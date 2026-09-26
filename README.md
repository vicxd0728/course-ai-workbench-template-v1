# AI 業務工作台｜課程模板 V1

這是進階實操課的第一個可操作原型。它不是正式 CRM，也不包含真實客戶資料。

## 課堂入口

- `/`：操作練習，跑完 AI 建議 → 人工決策 → 任務 → 結果回流。
- `/guide.html`：手機優先的新手建置控制台，依序完成取得模板、啟動、客製、三案例、驗收、修復、發布與 adapter 替換；每一步都有完整指令與失敗處理。

GitHub＋Cloudflare Pages 的發布步驟見 `CLOUDFLARE_DEPLOYMENT.md`。

- GitHub：<https://github.com/vicxd0728/course-ai-workbench-template-v1>
- 公開操作頁：<https://course-ai-workbench-template-v1.pages.dev/>
- 公開建置控制台：<https://course-ai-workbench-template-v1.pages.dev/guide.html>

## 兩種模式

- 範例模式：沒有 `.env` 也能操作，資料只保存在目前瀏覽器。
- 雲端模式：設定 Supabase 後，使用 Email 登入並跨裝置讀寫。

## 課堂設定

1. 複製 `.env.example` 為 `.env`。
2. 填入自己的 Supabase Project URL 與 publishable key。
3. 在 Supabase SQL Editor 執行 `supabase/schema.sql`。
4. 啟動模板並使用 Email 登入。

管理用 service key 不得放入 `.env`、GitHub 或瀏覽器。

## 學員主要修改位置

- `src/config.js`：名稱、欄位、階段與人工決策。
- `src/demo-data.js`：三筆去識別化測試資料。
- `.env`：個人 Supabase 專案設定，不提交 GitHub。

## 目前狀態

- UI：draft prototype。
- 本機範例模式：已實作並完成 Desktop／390px Mobile 操作驗證。
- Supabase adapter 與 RLS schema：已實作，待連接真實測試專案。
- Cloudflare Pages：已部署並完成桌機線上讀回；實體手機掃碼仍待課堂前確認。
- Vic 視覺與操作接受：待確認。

詳細證據見 `VERIFICATION.md`。
