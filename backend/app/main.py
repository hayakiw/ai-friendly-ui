import json
import os
from typing import Literal, Optional

import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Customer(BaseModel):
    id: int
    name: str


class PromptContext(BaseModel):
    current_page: Literal["list", "detail", "edit"]
    current_customer_id: Optional[int] = None
    customers: list[Customer]


class PromptRequest(BaseModel):
    prompt: str
    context: PromptContext


class PromptAction(BaseModel):
    action: Literal[
        "navigate_to_detail",
        "navigate_to_edit",
        "navigate_to_list",
        "update_field",
        "save",
        "unknown",
    ]
    customer_id: Optional[int] = None
    field: Optional[Literal["name", "company", "email", "phone", "address"]] = None
    value: Optional[str] = None
    message: str


SYSTEM_INSTRUCTION = """あなたは顧客管理アプリのコマンド解釈エンジンです。
ユーザーの自然言語プロンプトと現在のアプリ文脈を受け取り、実行すべきアクションをJSONのみで返してください。

出力形式 (JSON以外の文字は一切出さない):
{
  "action": "navigate_to_detail" | "navigate_to_edit" | "navigate_to_list" | "update_field" | "save" | "unknown",
  "customer_id": <整数 または null>,
  "field": "name" | "company" | "email" | "phone" | "address" | null,
  "value": "<文字列 または null>",
  "message": "<実行内容の日本語の短い説明>"
}

アクションの意味:
- navigate_to_detail: 指定した顧客の詳細画面を開く。customer_id 必須
- navigate_to_edit: 指定した顧客の編集画面を開く。customer_id 必須
- navigate_to_list: 顧客一覧画面に戻る
- update_field: 編集画面で表示中の顧客の項目を更新する。field と value 必須
- save: 編集内容を保存する
- unknown: 解釈できなかった場合

ルール:
- プロンプトから顧客を特定する時は、context.customers の name と照合して id を返す
- 名前が曖昧でも部分一致や漢字/ひらがな/カタカナゆらぎを考慮して推測する
- 編集系アクション (update_field, save) は current_page が edit の時のみ有効
- 不要なフィールドは null を入れる
- message は日本語で簡潔に (例: 「山田太郎さんの詳細画面を開きます」)
"""

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/prompt", response_model=PromptAction)
def handle_prompt(req: PromptRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_INSTRUCTION,
    )

    user_message = (
        f"現在の画面: {req.context.current_page}\n"
        f"表示中の顧客ID: {req.context.current_customer_id}\n"
        f"顧客一覧: {json.dumps([c.model_dump() for c in req.context.customers], ensure_ascii=False)}\n"
        f"ユーザーのプロンプト: {req.prompt}"
    )

    try:
        response = model.generate_content(
            user_message,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")

    try:
        data = json.loads(response.text)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to parse Gemini response: {e}"
        )

    return PromptAction(**data)
