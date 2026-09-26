# AI 業務工作台模板 V1｜驗證紀錄

> 日期：2026-09-26  
> 狀態：local course template verified；Cloudflare desktop readback verified

## 已通過

### Deterministic checks

- `npm test`：5／5 通過。
  - 六個 adapter 動作存在。
  - `work_items`、`work_events` 已啟用 RLS。
  - 瀏覽器來源與 `.env.example` 未引用 Supabase service role key。
  - QR 指令中心包含八個建置階段與三個既有教學案例。
  - 指令卡包含用途、先決條件、完整指令、預期結果、成功檢查與失敗處理。
- `npm run build`：Vite production build 通過。
- 成功產生 `dist/index.html` 與 `dist/guide.html`。

### Desktop rendered review

- 三欄工作台可見：工作清單、Customer 360、AI 建議與人工決策。
- QR 指令中心可依八階段逐步建置，步驟卡可展開／收合。
- 快速導覽、複製按鈕、進度顯示與證據包皆可見。
- 沒有行銷首頁阻擋主要操作。

### 390px mobile rendered review

- 指令中心與工作台皆可在單欄閱讀。
- 實測：`innerWidth = 390`、`documentElement.scrollWidth = 375`，整頁無水平溢出。
- 完整指令、檢查項目與失敗處理維持可讀。

### Interaction review

- 八階段完成進度可由 0／8 改為 1／8，並可重設為 0／8。
- 複製按鈕可顯示成功確認訊息。
- 北辰工具、海港設備、遠景貿易三個案例仍保留。
- 瀏覽器 console：0 errors、0 warnings。

### GitHub／Cloudflare live readback

- GitHub 公開儲存庫已建立：`https://github.com/vicxd0728/course-ai-workbench-template-v1`。
- Cloudflare Pages 已部署：`https://course-ai-workbench-template-v1.pages.dev/`。
- 正式 `guide.html` 已線上讀回，八階段、三案例與主要按鈕可見。
- 正式首頁與 `guide.html` 的 console 均為 0 errors／warnings。
- 線上複製按鈕已顯示「已複製」回饋。

## 尚未驗證

- 實體手機掃描 PPT QR、手機操作與無痕視窗完整驗收。
- 真實 Supabase 專案連線與 Email magic-link 登入。
- A 使用者無法讀取 B 使用者資料的實際 RLS 測試。
- 電腦寫入、手機讀取、手機更新、電腦讀回。
- 20 人同時操作與完整 180 分鐘真人試跑。

## 完成語言

- UI draft：已實作。
- Local course template：已驗證。
- QR instruction center：本機已驗證。
- Cloud static prototype：桌機線上讀回已驗證；資料庫與跨裝置未驗證。
- Course template：等待 Vic 檢視與實際試教，不標示 locked／accepted。
