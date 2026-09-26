export const workflowConfig = {
  appName: "AI 業務工作台",
  entityLabel: "跟進項目",
  listTitle: "今天要處理",
  primaryColor: "#0c6170",
  stages: ["詢價", "確認需求", "報價準備", "等待回覆", "完成"],
  decisions: [
    { id: "adopt", label: "採用", tone: "success" },
    { id: "modify", label: "修改", tone: "primary" },
    { id: "defer", label: "延後", tone: "warning" },
    { id: "reject", label: "退回", tone: "danger" }
  ],
  fields: [
    { key: "country", label: "國家" },
    { key: "stage", label: "階段" },
    { key: "last_contact", label: "最近聯絡" },
    { key: "next_contact", label: "下次聯絡" }
  ]
};

export function hasSupabaseConfig(env = import.meta.env) {
  const url = env.VITE_SUPABASE_URL || "";
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  return url.startsWith("https://") && key.length > 20 && !url.includes("YOUR_PROJECT");
}
