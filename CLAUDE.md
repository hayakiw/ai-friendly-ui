# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code (claude.ai/code) 向けのガイドです。

## Overview

プロンプト（自然言語）で操作できる顧客管理UIのデモ。Gemini 2.5 Flash がプロンプトを解釈して構造化されたアクションJSONを返し、フロントエンドがそれを実行する。

- **frontend**: Next.js 14 (App Router, `"use client"` ページ中心) + TypeScript + Tailwind + framer-motion
- **backend**: FastAPI 1ファイル (`backend/app/main.py`)。Gemini API をラップして `PromptAction` を返すだけ
- **データ**: 永続化なし。ダミー顧客10件を `frontend/app/data/customers.ts` に埋め込み、React Context (`StoreProvider`) で保持

## 開発コマンド

**通常起動 (推奨):**
```
docker compose up --build     # frontend: :3000, backend: :8000
docker compose up -d          # バックグラウンド
docker compose logs -f frontend
```

`.env` に `GEMINI_API_KEY` が必要（`.env.example` 参照）。

**Dockerなしで動かす場合:**
```
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

cd frontend && npm install
npm run dev
```

テストランナーもリンターも未設定。`npm run build` で TypeScript 型チェック兼ビルド、`backend/app/__pycache__/` は Docker ボリューム経由で生成されるので commit しない。

## アーキテクチャの核

### プロンプト → アクションのフロー

1. `frontend/app/components/SearchBar.tsx` がプロンプト（テキスト or Web Speech API）を収集し、`POST /api/prompt` に `{ prompt, context }` を送る。`context` は `current_page` (`list` / `detail` / `edit`) と `current_customer_id` と 顧客の `{id, name}` 配列。
2. `backend/app/main.py` の `handle_prompt` が Gemini に投げる。`SYSTEM_INSTRUCTION` にアクションスキーマの定義が丸ごと入っている（`response_mime_type="application/json"` + `temperature=0.2` で JSON 決定的に取得）。
3. レスポンスは `PromptAction` (action / customer_id / field / value / message)。`SearchBar` の `executeAction` が switch で分岐し、ナビゲーションは `router.push`、フィールド更新・保存は `StoreProvider` のメソッドを呼ぶ。

### アクションスキーマは4箇所に重複している

同じ形が以下の4ファイルに分散しているので、アクションを追加・変更するときは**4箇所すべてを同期**させる必要がある：

- `backend/app/main.py` の `PromptAction` Pydantic クラス（型定義）
- `backend/app/main.py` の `SYSTEM_INSTRUCTION` 文字列（LLM へのスキーマ指示）
- `frontend/app/components/SearchBar.tsx` の `PromptAction` TypeScript 型
- `frontend/app/components/SearchBar.tsx` の `executeAction` switch（実行ロジック）

現在のアクション: `navigate_to_detail` / `navigate_to_edit` / `navigate_to_list` / `update_field` / `save` / `unknown`。

### 編集可能フィールドは5つ

`update_field` の `field` は `name | company | email | phone | address` に限定（`kana` は除外 — 編集画面で readOnly）。これも上記4箇所で揃える。

### 編集系アクションの前提条件

`update_field` と `save` は `current_page === "edit"` のときのみ有効。LLM 側の `SYSTEM_INSTRUCTION` でもそう指示しているが、フロント側でも `editDraft` (StoreProvider) の存在を確認してから実行し、なければ「編集画面で実行してください」を toast する防御を入れている。

### State の持ち方

`frontend/app/store.tsx` の `StoreProvider` が単一の truth。
- `customers`: 顧客一覧（`commitDraft()` でのみ更新される）
- `editDraft`: 編集画面に入ったときに `loadDraft(id)` で複製、画面離脱時に `clearDraft()`
- `toast`: 2.5秒で自動消滅

永続化がないのでブラウザリロードで全部リセットされる点に注意。

### ルーティング

- `/` → 一覧 (`frontend/app/page.tsx`)
- `/customers/[id]` → 詳細
- `/customers/[id]/edit` → 編集

`SearchBar` は `usePathname()` から `current_page` を導出している（`/edit` 末尾判定）。ルート構造を変えるときはここも要修正。

### backend URL の注入

フロントは `process.env.NEXT_PUBLIC_BACKEND_URL` を参照（デフォルト `http://localhost:8000`）。Docker Compose では `docker-compose.yml` で注入済み。ブラウザから叩かれるのでホスト名はコンテナ名ではなく `localhost` にする必要がある。

## プロンプト例（動作確認用）

- `山田さんの詳細画面を開いて` → navigate_to_detail
- `住所を東京都新宿区西新宿1-1-1に変更して`（編集画面で）→ update_field
- `保存して`（編集画面で）→ save → 詳細画面へ遷移
- `一覧に戻って` → navigate_to_list
