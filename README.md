# AI-Friendly 顧客管理UI デモ

プロンプトで操作できる顧客管理画面のサンプル。Gemini 2.5 Flash が自然言語を解釈してUIを動かす。

## 構成

- **frontend**: Next.js 14 (App Router) + TypeScript + Tailwind + framer-motion
- **backend**: FastAPI — Gemini APIをラップしてアクションJSONを返す
- **データ**: フロントエンドにダミー顧客10件を埋め込み（永続化なし）

## 起動

1. `.env.example` を `.env` にコピーし、`GEMINI_API_KEY` を設定

   ```
   cp .env.example .env
   # .env を編集して Gemini API key を貼り付け
   ```

2. Docker Compose で起動

   ```
   docker compose up --build
   ```

3. ブラウザで `http://localhost:3000` を開く

## プロンプト例

検索バーに自然言語で入力：

- `山田さんの詳細画面を開いて` → 山田太郎の詳細画面にアニメーション遷移
- `鈴木花子さんの編集画面を開いて` → 鈴木花子の編集画面に遷移
- `住所を東京都新宿区西新宿1-1-1に変更して` (編集画面で) → 住所欄が変わる
- `保存して` (編集画面で) → 保存して詳細画面に戻る
- `一覧に戻って` → 一覧画面に戻る

## エンドポイント

- `POST /api/prompt` — プロンプトと現在の画面文脈を送ると、実行すべきアクションが返る
