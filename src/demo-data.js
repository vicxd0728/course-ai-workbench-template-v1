export const demoItems = [
  {
    id: "demo-1",
    customer_name: "北辰工具（範例）",
    country: "日本",
    stage: "確認需求",
    priority: "P1",
    status: "open",
    summary: "客戶詢問兩款接頭規格，尚缺預計數量與需求日期。",
    last_contact: "2026-09-18",
    next_contact: "2026-09-23",
    recommendation: {
      evidence: "距上次聯絡 5 天；數量與需求日期尚未確認。",
      next_action: "先詢問預計數量與需求日期，再進入報價準備。",
      risk: "不可在規格未確認前承諾價格或交期。",
      missing: ["預計數量", "需求日期"]
    }
  },
  {
    id: "demo-2",
    customer_name: "海港設備（範例）",
    country: "新加坡",
    stage: "等待回覆",
    priority: "P2",
    status: "waiting",
    summary: "樣品資料已提供，等待客戶回覆測試結果。",
    last_contact: "2026-09-20",
    next_contact: "2026-09-27",
    recommendation: {
      evidence: "已完成樣品資料交付，尚未超過約定回覆時間。",
      next_action: "保留追蹤日期，不需提前催促。",
      risk: "過早追問可能增加客戶壓力。",
      missing: []
    }
  },
  {
    id: "demo-3",
    customer_name: "遠景貿易（範例）",
    country: "德國",
    stage: "報價準備",
    priority: "P0",
    status: "needs_review",
    summary: "客戶要求特殊價格與指定交期，需要主管判斷。",
    last_contact: "2026-09-21",
    next_contact: "2026-09-22",
    recommendation: {
      evidence: "內容涉及特殊價格與交期承諾，超出 AI 決策權限。",
      next_action: "整理現有資料並建立主管確認任務。",
      risk: "未經人工確認不得對外回覆價格與交期。",
      missing: ["主管核准", "可承諾交期"]
    }
  }
];

export const initialEvents = {
  "demo-1": [
    { id: "e-11", event_type: "source", note: "收到客戶規格詢問", created_at: "2026-09-18T08:10:00Z" },
    { id: "e-12", event_type: "ai", note: "辨識缺少數量與需求日期", created_at: "2026-09-21T01:15:00Z" }
  ],
  "demo-2": [
    { id: "e-21", event_type: "activity", note: "已提供樣品測試資料", created_at: "2026-09-20T03:30:00Z" }
  ],
  "demo-3": [
    { id: "e-31", event_type: "risk", note: "偵測到價格與交期承諾風險", created_at: "2026-09-21T04:20:00Z" }
  ]
};
