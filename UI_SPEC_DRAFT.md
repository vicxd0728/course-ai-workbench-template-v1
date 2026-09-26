# AI 業務工作台｜UI Spec Draft

> 狀態：draft，等待 Desktop／Mobile 預覽確認；尚未 locked、尚未部署。

## Goal

讓沒有 CRM 的學員，在課堂中把一條業務工作流裝入模板，並完成資料 → AI 建議 → 人工決策 → 任務 → 結果回流。

## Primary user and task

- 使用者：中小企業老闆、主管、業務與助理。
- 第一個任務：打開後立即知道今天要處理哪一筆，完成一次人工判斷與結果紀錄。

## Route and context

- 單一路由 `/`。
- 未設定 Supabase：範例模式，使用瀏覽器儲存。
- 已設定 Supabase：先登入，再載入使用者自己的資料。

## Desktop layout

1. 左欄：工作清單、P0／P1、階段與到期日。
2. 中欄：Customer 360 摘要、欄位與活動時間線。
3. 右欄：AI 建議、Human Gate、任務與結果表單。

## Mobile layout

1. 頂部顯示模式與登出／重設。
2. 工作清單橫向滑動。
3. 選擇後依序顯示資料摘要、AI 建議、人工決策、任務、結果與歷史。
4. 觸控按鈕至少 40px，高風險行動不使用手勢取代文字按鈕。

## Fields

- 客戶／工作名稱、國家、階段、Priority。
- 摘要、最近聯絡、下次聯絡。
- Evidence、Next Action、Risk、Missing。
- Decision、Decision Note。
- Task Title、Due Date。
- Outcome、Outcome Status、Next Contact。

## Actions and state transitions

```text
open / waiting / needs_review
  → adopt | modify | defer | reject
  → create action
  → in_progress
  → save outcome
  → waiting | completed
```

每個動作都新增時間線事件。AI 不會直接寄送訊息、報價或承諾交期。

## Required states

- Loading：骨架區塊。
- Empty：提示先新增去識別化資料。
- Error：保留目前畫面並顯示可理解錯誤。
- Success：顯示短暫確認訊息，並從資料來源重新讀取。
- Demo：清楚標示只保存在本機。
- Cloud：清楚標示跨裝置同步。
- Permission-limited：Supabase RLS 不允許讀取其他使用者資料。

## Forbidden actions

- 不自動寄信、報價或修改正式 CRM。
- 不在瀏覽器使用 Supabase 管理用 service key。
- 不把正式客戶資料放進課堂公用專案。
- 不允許 A 學員讀取 B 學員資料。

## Non-goals

- 完整 CRM、ERP、Email 或 WhatsApp 整合。
- 多公司／多角色權限管理。
- 課堂中自訂資料庫 schema。
- AI API 與自動化排程。

## Acceptance criteria

1. 桌面可在同一畫面完成選取、判斷、任務與結果。
2. 390px 手機無水平頁面溢出，主要操作可完成。
3. 範例模式重新整理後資料仍在同一裝置。
4. 雲端模式需登入，資料由 Supabase RLS 依使用者隔離。
5. 電腦建立的資料能在手機讀到，手機更新能在電腦讀回。
6. 正常、缺資料、涉及價格／交期三個案例都有明確處理。

## Review evidence pending

- Desktop rendered preview。
- 390px Mobile rendered preview。
- Vic 對欄位、按鈕、順序、手機行為與禁用行為的確認。
- Supabase 實際跨裝置測試。
- Cloudflare Pages 實際部署讀回。
