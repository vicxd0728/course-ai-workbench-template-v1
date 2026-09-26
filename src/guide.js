import "./guide.css";

const STORAGE_KEY = "course-build-console-progress-v1";

const buildStages = [
  {
    id: "get-template", number: "01", title: "取得模板", time: "約 5 分鐘",
    purpose: "取得講師提供的完整專案，先盤點現況，不從空白手動建立檔案。",
    prerequisites: ["講師提供的 ZIP 或 GitHub 模板網址", "不含公司正式資料的練習資料夾", "Node.js 20 以上版本"],
    commands: [
      { label: "GitHub 取得方式（有網址時）", language: "終端機", value: `git clone <講師提供的模板網址>
cd course-ai-workbench-template-v1` },
      { label: "唯讀盤點指令", language: "Codex", value: `你是我的課堂建置助手。請先只讀取目前資料夾，不要修改任何檔案。

請依序檢查 README.md、package.json、src/config.js、src/demo-data.js、src/main.js、src/services/demo-adapter.js、src/services/supabase-adapter.js 與 tests/template-contract.test.mjs。

請用繁體中文回報：
1. 目前已可使用的功能。
2. 學員主要應修改的檔案。
3. 不得破壞的 adapter、Human Gate 與安全規則。
4. 啟動與驗證指令。
5. 尚未完成雲端驗證的項目。

不得部署、不得加入真實客戶資料、不得改檔。` }
    ],
    expected: "AI 能列出既有工作台、三案例、人工決策、任務、結果回流與兩種 adapter，而不是提議重寫系統。",
    checks: ["看得到 package.json、src、tests", "AI 指出主要修改位置", "沒有把範例模式說成已部署"],
    failures: ["沒有 GitHub 網址：使用講師提供的離線 ZIP，完整解壓後再開啟。", "找不到 package.json：回到含 package.json 的模板根目錄。", "Node.js 不存在：改用離線備援，不在課堂中重裝環境。"]
  },
  {
    id: "start-local", number: "02", title: "啟動本機系統", time: "約 8 分鐘",
    purpose: "安裝套件、跑基本檢查，並在自己的筆電打開工作台。",
    prerequisites: ["終端機位於模板根目錄", "已安裝 Node.js 與 npm", "4175 連接埠未被占用"],
    commands: [
      { label: "Windows PowerShell", language: "PowerShell", value: `npm.cmd install
npm.cmd test
npm.cmd run dev -- --port 4175` },
      { label: "macOS Terminal", language: "Terminal", value: `npm install
npm test
npm run dev -- --port 4175` }
    ],
    expected: "終端機顯示測試通過與 Local 網址；開啟 http://127.0.0.1:4175/ 後可看到三筆去識別案例。",
    checks: ["測試沒有 fail", "操作頁顯示三筆案例", "標示本機練習／範例模式", "重新整理後仍能打開"],
    failures: ["4175 被占用：改用 npm.cmd run dev -- --port 4176，網址也改為 4176。", "npm 不存在：確認 Node.js，或交由助教使用離線備援。", "畫面空白：保留完整錯誤，前往第 06 步。"]
  },
  {
    id: "customize", number: "03", title: "客製自己的流程", time: "約 25 分鐘",
    purpose: "把模板改成一條小而明確的工作流；保留資料契約、Human Gate 與結果回流。",
    prerequisites: ["模板已能啟動", "已選一條小流程，不是整套 CRM", "已準備去識別化的角色、欄位、狀態與完成條件"],
    commands: [{ label: "完整流程客製化指令", language: "Codex", value: `請在目前的 AI 業務工作台模板中，建立我的課堂練習版本。先讀 README.md、src/config.js、src/demo-data.js、src/main.js、兩個 adapter 與 tests，再開始修改。

我的流程資料如下（請先把中括號換成我的內容）：
- 流程名稱：[例如：報價前資料確認]
- 主要使用者：[角色]
- 資料來源：[試算表／Notion／既有 CRM／本機假資料]
- 正式身份或穩定 ID：[欄位]
- 資料截止時間：[欄位或顯示方式]
- 狀態：[狀態清單]
- 四個 Signal：[立即處理／今天必做／AI 待判定／資料待補]
- AI 輸出：[Priority／Evidence／Next Action／Missing 或 Risk／Completion Condition]
- Human Gate：[採用／修改／延後／退回]
- 人工決策人：[角色]
- 正式任務欄位：[Owner／Due／來源／完成條件]
- 結果回寫位置：[時間線或歷史]

實作規則：
1. 優先修改 src/config.js 與 src/demo-data.js；只有顯示必要資訊時才最小修改 src/main.js 與 src/styles.css。
2. 不得改變 adapter 介面、Supabase schema、Human Gate 或結果回流。
3. 不得加入真實客戶、Email、電話、價格、對話或公司未公開資訊。
4. AI 建議不可冒充正式任務、已發送或已完成。
5. 身份未確認時保留 mapping_unverified，只能建立補資料工作。
6. 已存在的正式任務要接續，不得重複建立。
7. 價格、交期、付款、規格、對外回覆與正式寫入保留人工核准。

完成後執行 npm.cmd test 與 npm.cmd run build。回報更動檔案、規則如何保留、測試結果與尚未驗證項目。不要部署。` }],
    expected: "名稱、欄位、狀態、角色與假資料已換成自己的流程，仍維持建議 → 人工判定 → 任務 → 結果 → 歷史。",
    checks: ["只做一條小流程", "看得到資料來源與日期", "AI 輸出含 Evidence、Missing／Risk 與完成條件", "四種 Human Gate 保留", "測試與 build 通過"],
    failures: ["AI 想重寫專案：停止並強調最小修改。", "欄位太多：只留決策、任務與回填需要的欄位。", "測試失敗：不要刪測試，前往第 06 步。"]
  },
  {
    id: "three-cases", number: "04", title: "建立並操作三案例", time: "約 25 分鐘",
    purpose: "用正常、身份／證據不足、高風險三種情境證明系統能處理例外。",
    prerequisites: ["自己的流程已套入", "只使用虛構資料", "知道正式任務與身份狀態欄位"],
    commands: [{ label: "產生三筆去識別測試資料", language: "Codex", value: `請保留目前版面與功能，只修改課堂測試資料，建立三筆完全虛構且可驗收的案例：

案例 A｜正常但已有正式任務
- 身份與來源已確認。
- 有 Evidence、Next Action、Completion Condition、Owner 與 Due。
- 已存在正式任務；只能開啟或接續，不得重複建立。

案例 B｜身份或證據不足
- 標示 mapping_unverified 或同義狀態。
- 列出 Missing 與來源缺口。
- 不准建立正式業務任務，只能建立補身份／補資料工作。

案例 C｜價格或交期高風險
- AI 可以整理 Evidence、風險與草稿。
- 人必須選擇採用、修改、延後或退回並留下理由。
- 不得標示已發送、已承諾或已完成。

每筆都要能執行人工判定、任務或補資料工作、結果回填、下一次日期與時間線讀回。不得加入真實客戶資料。

完成後執行 npm.cmd test 與 npm.cmd run build，回報三案例的停止條件。不要部署。` }],
    expected: "三筆案例分別接續既有任務、先補身份／證據、以及高風險人工攔截。",
    checks: ["A 沒有重複任務", "B 只能建立補資料工作", "C 沒有顯示已發送或已承諾", "人的決定與結果可讀回"],
    failures: ["三筆只有文案不同：要求不同狀態與按鈕後果。", "缺資料仍可建正式任務：列為 blocker 並修正 identity Gate。", "高風險自動完成：停止使用並重新修復。"]
  },
  {
    id: "acceptance", number: "05", title: "執行九項驗收", time: "約 20 分鐘",
    purpose: "用程式檢查與實際點測留下證據，不以「看起來可以」判定完成。",
    prerequisites: ["三案例已建立", "本機預覽可打開", "畫面中沒有正式資料"],
    commands: [{ label: "自動檢查與桌機／手機驗收", language: "Codex", value: `請對目前模板執行唯讀優先的完整驗收；發現問題先回報，不要直接大改。

先執行 npm test 與 npm run build，再啟動本機預覽，實際檢查桌面與 390px 手機：
1. 已改成我的流程名稱、欄位、狀態與角色。
2. 至少三筆去識別測試資料。
3. 能辨識資料來源、截止時間與四個 Signal。
4. 工作卡有 Priority、Evidence、Missing／Risk、Next Action、Completion Condition。
5. 四種 Human Gate 可使用並留下理由。
6. 案例 A 接續既有任務，不重複建立。
7. 案例 B 身份／證據不足時只建立補資料工作。
8. 案例 C 高風險不顯示已發送或已承諾。
9. 任務、結果、下一次日期能在歷史讀回；重新啟動後仍可操作。

同時檢查 loading、空資料、部分資料、過期資料、錯誤提示、鍵盤焦點、觸控大小、390px 水平溢出與 console。

輸出逐項 PASS／FAIL／未驗證、證據位置、畫面尺寸與錯誤。不要把 build 通過說成部署成功，也不要部署。` }],
    expected: "得到九項逐項結果、桌面／390px 證據與未驗證清單；FAIL 不會被包裝成完成。",
    checks: ["test 與 build 通過", "九項逐項有結果", "三案例實際點測", "390px 無水平溢出", "console 無未處理錯誤"],
    failures: ["只有 build：補做桌面／手機與案例點測。", "只有截圖：補做按鈕、時間線與重新啟動讀回。", "任何 FAIL：保留錯誤證據，再進入第 06 步。"]
  },
  {
    id: "repair", number: "06", title: "最小範圍修復", time: "依錯誤而定",
    purpose: "把原始錯誤交回 AI，只修根因並重新跑同一組驗收。",
    prerequisites: ["保留完整錯誤文字或畫面", "知道失敗驗收項目", "未用刪測試或清資料掩蓋問題"],
    commands: [{ label: "失敗修復指令", language: "Codex", value: `目前第 [步驟或驗收編號] 失敗。以下是原始錯誤與重現方式：

[貼上完整錯誤文字]

重現步驟：
1. [第一步]
2. [第二步]
3. [實際結果]

請先判斷根因，再提出最小修改方案。限制：
- 不得刪除或放寬既有測試。
- 不得破壞 adapter、Human Gate、任務去重、結果回流或安全規則。
- 不得清資料來假裝修好。
- 不得加入真實資料、密碼或金鑰。
- 不得重構無關檔案。

修復後重跑原失敗步驟、npm test、npm run build 與受影響的桌面／390px 操作。回報根因、更動檔案、證據與未驗證項目。不要部署。` }],
    expected: "AI 說明根因、只改必要檔案，原失敗步驟與回歸測試都重新通過。",
    checks: ["錯誤可重現", "修改範圍與根因一致", "未刪安全規則或測試", "原步驟與回歸測試重跑"],
    failures: ["AI 一次改太多：要求先列根因與允許檔案。", "出現新回歸：比對修復前後變更。", "環境問題未解：用備援並標記未驗證，不能寫 PASS。"]
  },
  {
    id: "publish", number: "07", title: "選配發布與手機驗證", time: "約 15 分鐘",
    purpose: "把已通過本機驗收的網站交給 GitHub 管版本，再由 Cloudflare Pages 發布。",
    prerequisites: ["本機九項驗收通過", "有 GitHub 儲存庫網址", "有 Cloudflare 帳號", "專案沒有 .env、密碼、金鑰或正式資料"],
    commands: [
      { label: "確認並推送 GitHub", language: "終端機", value: `npm run test
npm run build
git status
git add .
git commit -m "Add course AI workbench"
git branch -M main
git remote add origin <你的 GitHub 儲存庫網址>
git push -u origin main` },
      { label: "Cloudflare Pages 設定值", language: "設定", value: `Framework preset: Vite
Build command: npm run build
Build output directory: dist
Environment variables: 範例模式留空` }
    ],
    expected: "Cloudflare 成功部署，HTTPS 網址可開啟 `/` 與 `/guide.html`；手機與無痕視窗都能操作。",
    checks: ["GitHub 沒有 .env 或金鑰", "Cloudflare build 成功", "兩頁互相切換", "手機與無痕通過", "QR 實掃落在 guide.html"],
    failures: ["remote 已存在：先用 git remote -v 檢查。", "Cloudflare 失敗：保存完整 log，回第 06 步。", "正式網址失敗：只能回報本機完成。", "QR 指向 127.0.0.1：換成正式網址後重掃。"]
  },
  {
    id: "adapter", number: "08", title: "替換資料 adapter", time: "課後延伸",
    purpose: "已有 Notion、Sheets、Supabase、D1、NAS 或公司 API 時，只替換資料轉接層。",
    prerequisites: ["demo adapter 已跑通", "知道正式身份、日期權威與權限", "決定唯讀或受控寫入", "有去識別測試環境"],
    commands: [{ label: "adapter 替換完整指令", language: "Codex", value: `請為目前 AI 業務工作台規劃並實作 [Notion／Google Sheets／Supabase／Cloudflare D1／NAS／公司 API] adapter，只替換資料轉接層，不重建 UI。

先讀 demo-adapter.js、supabase-adapter.js、main.js、config.js 與 tests，維持：listRecords、getRecord、saveDecision、createAction、saveOutcome、getHistory。

資料契約：
1. 每筆有穩定 ID、來源、來源日期、截止與 freshness。
2. 正式任務、AI 建議、草稿、已發送、已完成是不同狀態。
3. mapping_unverified 不得建立正式任務。
4. createAction 用穩定鍵去重且具冪等性。
5. 寫入後須從目的地 readback 才能回報成功。
6. 價格、交期、付款、規格、外聯與正式寫入保留 Human Gate。
7. 瀏覽器不得包含管理用密鑰；權限不足、逾時、部分與過期資料要明示。
8. 先用去識別資料與唯讀模式驗證。

先輸出欄位映射、權限與風險、允許修改檔案、測試計畫與回復方案。等我確認後才實作。不得連接或修改正式資料。` }],
    expected: "先得到欄位映射、權限、風險與測試計畫；確認後才新增 adapter，UI 合約不變。",
    checks: ["六個動作都有對應", "穩定 ID 與日期權威明確", "去重、Human Gate、readback 有測試", "管理密鑰不進瀏覽器", "正式環境未修改"],
    failures: ["AI 要重寫 UI：停止並重申只換 adapter。", "沒有穩定 ID：先做 mapping 與人工確認。", "沒有 readback：不能宣稱同步成功。", "需要正式權限：先做 mock／sandbox，待另行授權。"]
  }
];

const caseCards = [
  { step: "案例一", title: "資料缺漏｜北辰工具", summary: "先辨識缺少的數量與需求日期，再把缺漏轉成任務。", commands: [{ label: "判斷理由", language: "輸入文字", value: "資料仍缺數量與需求日期，修改後採用" }, { label: "任務內容", language: "輸入文字", value: "先詢問預計數量與需求日期，再進入報價準備。" }], action: "在操作頁點「修改」，選擇到期日後儲存任務。" },
  { step: "案例二", title: "避免過度追蹤｜海港設備", summary: "尚未超過約定時間時，保留下次追蹤日期，不把所有項目列為 P0。", commands: [{ label: "判斷理由", language: "輸入文字", value: "尚未超過約定回覆時間，保留下次追蹤日期" }], action: "在操作頁點「延後」，不建立立即催促客戶的任務。" },
  { step: "案例三", title: "高風險人工攔截｜遠景貿易", summary: "價格、交期與正式承諾必須由人確認。", commands: [{ label: "判斷理由", language: "輸入文字", value: "涉及特殊價格與交期，退回主管確認" }, { label: "任務內容", language: "輸入文字", value: "整理現有資料並建立主管確認任務" }, { label: "執行結果", language: "輸入文字", value: "已建立主管確認任務，尚未對外回覆" }], action: "點「退回」並建立任務；結果選「等待後續」，再寫回時間線。" }
];

function escapeHtml(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function readProgress() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } }
const completedStages = readProgress();
function writeProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStages])); }

function commandBlock(command) { return `<div class="command-block"><div class="command-heading"><div><span>${escapeHtml(command.label)}</span><small>${escapeHtml(command.language || "可複製內容")}</small></div><button class="copy-button" type="button" data-copy="${escapeHtml(command.value)}" aria-label="複製${escapeHtml(command.label)}">複製</button></div><pre tabindex="0"><code>${escapeHtml(command.value)}</code></pre></div>`; }
function listBlock(title, items, tone = "neutral") { return `<section class="instruction-panel ${tone}"><h4>${escapeHtml(title)}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`; }
function stageCard(stage, index) {
  const complete = completedStages.has(stage.id);
  return `<details class="build-card ${complete ? "is-complete" : ""}" id="${stage.id}" ${index === 0 ? "open" : ""}><summary><span class="stage-number">${stage.number}</span><span class="stage-summary"><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.purpose)}</small></span><span class="stage-time">${escapeHtml(stage.time)}</span><span class="stage-state" aria-label="${complete ? "已完成" : "未完成"}">${complete ? "✓" : ""}</span></summary><div class="stage-body"><div class="stage-context"><section><h3>用途</h3><p>${escapeHtml(stage.purpose)}</p></section>${listBlock("先決條件", stage.prerequisites)}</div><section class="stage-commands"><h3>完整可複製指令</h3><div class="command-list">${stage.commands.map(commandBlock).join("")}</div></section><div class="result-grid"><section class="instruction-panel expected"><h4>預期結果</h4><p>${escapeHtml(stage.expected)}</p></section>${listBlock("成功檢查", stage.checks, "success")}${listBlock("失敗時怎麼做", stage.failures, "danger")}</div><div class="stage-footer"><button class="complete-button ${complete ? "complete" : ""}" type="button" data-stage="${stage.id}" aria-pressed="${complete}">${complete ? "已標記完成" : "標記這一步完成"}</button>${index < buildStages.length - 1 ? `<a href="#${buildStages[index + 1].id}">前往下一步</a>` : `<a href="#evidence">整理成果證據</a>`}</div></div></details>`;
}

function renderGuide() {
  const count = completedStages.size;
  document.querySelector("#guide-app").innerHTML = `<header class="guide-topbar"><a class="guide-brand" href="./guide.html" aria-label="回到新手建置控制台首頁"><span aria-hidden="true">AI</span><strong>新手建置控制台</strong></a><nav class="page-tabs" aria-label="課堂頁面"><a href="./">操作練習</a><a class="active" href="./guide.html" aria-current="page">建置控制台</a></nav></header><main>
  <section class="guide-hero"><p class="eyebrow">整堂課只需要掃一次</p><h1>從模板到可驗收系統，逐步完成</h1><p>在筆電執行建置，手機用來查看與複製指令。每一步都有預期結果、成功檢查與失敗修復，不需要從 PPT 手動抄寫。</p><div class="hero-actions"><a class="primary-link" href="#get-template">開始建置</a><a class="secondary-link" href="#three-cases">三案例驗收</a><a class="secondary-link" href="#publish">發布與手機</a></div></section>
  <section class="privacy-alert" aria-labelledby="privacy-title"><span class="alert-icon" aria-hidden="true">!</span><div><h2 id="privacy-title">全程只使用虛構、去識別資料</h2><p>不要輸入真實客戶名稱、Email、電話、價格、對話、規格、密碼、金鑰或公司未公開資訊。</p></div></section>
  <section class="console-overview"><div><p class="section-kicker">本機優先，發布選配</p><h2>先完成可重啟、可操作、可讀回</h2><p>這個教學中心不需要登入或資料庫；進度只存在目前瀏覽器。共同及格門檻是本機系統與三案例通過，Cloudflare 是選配。</p></div><div class="progress-card" aria-label="建置進度"><div><strong id="progress-count">${count}／${buildStages.length}</strong><span>步已標記完成</span></div><progress id="build-progress" max="${buildStages.length}" value="${count}"></progress><button id="reset-progress" type="button">重設進度</button></div></section>
  <nav class="stage-nav" aria-label="建置步驟快速導覽">${buildStages.map((s) => `<a href="#${s.id}"><span>${s.number}</span>${escapeHtml(s.title)}</a>`).join("")}</nav>
  <section class="build-flow" aria-label="八階段建置流程">${buildStages.map(stageCard).join("")}</section>
  <section class="content-section" aria-labelledby="cases-title"><div class="section-heading"><div><p class="section-kicker">保留原始共同示範</p><h2 id="cases-title">三個既有案例操作文字</h2></div><a href="./">前往操作練習</a></div><div class="case-list">${caseCards.map((card) => `<article class="case-card"><div class="case-intro"><span>${card.step}</span><h3>${card.title}</h3><p>${card.summary}</p></div><div class="command-list">${card.commands.map(commandBlock).join("")}</div><p class="case-action"><strong>接著做：</strong>${card.action}</p></article>`).join("")}</div></section>
  <section id="evidence" class="evidence-panel"><p class="section-kicker">離場前整理</p><h2>成果證據包</h2><p>保存下列內容，才能在課後繼續：</p><ul><li>流程名稱、欄位、狀態、角色與資料來源。</li><li>三筆去識別資料與三案例結果。</li><li>測試、build、九項驗收與未驗證項目。</li><li>本機啟動指令；選配發布者再附正式網址與手機驗證。</li><li>adapter 的欄位映射、權限、readback 與回復方案。</li></ul><a class="primary-link" href="./">開啟操作練習</a></section>
  </main><div id="copy-status" class="copy-status" role="status" aria-live="polite" aria-atomic="true"></div>`;
}

async function copyText(value) { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(value); return; } const textarea = document.createElement("textarea"); textarea.value = value; textarea.setAttribute("readonly", ""); textarea.style.position = "fixed"; textarea.style.opacity = "0"; document.body.append(textarea); textarea.select(); const copied = document.execCommand("copy"); textarea.remove(); if (!copied) throw new Error("copy failed"); }
function updateProgressUI() { document.querySelector("#progress-count").textContent = `${completedStages.size}／${buildStages.length}`; document.querySelector("#build-progress").value = completedStages.size; }
function bindEvents() {
  const status = document.querySelector("#copy-status");
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => { const original = button.textContent; try { await copyText(button.dataset.copy); button.textContent = "已複製"; button.classList.add("copied"); status.textContent = `${button.getAttribute("aria-label")}成功`; } catch { status.textContent = "無法自動複製，請長按文字後選擇複製。"; } window.setTimeout(() => { button.textContent = original; button.classList.remove("copied"); }, 2200); }));
  document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => { const id = button.dataset.stage; const wasComplete = completedStages.has(id); if (wasComplete) completedStages.delete(id); else completedStages.add(id); writeProgress(); button.textContent = wasComplete ? "標記這一步完成" : "已標記完成"; button.classList.toggle("complete", !wasComplete); button.setAttribute("aria-pressed", String(!wasComplete)); const card = button.closest(".build-card"); card?.classList.toggle("is-complete", !wasComplete); const badge = card?.querySelector(".stage-state"); if (badge) { badge.textContent = wasComplete ? "" : "✓"; badge.setAttribute("aria-label", wasComplete ? "未完成" : "已完成"); } updateProgressUI(); status.textContent = wasComplete ? "已取消完成標記" : "已保存完成狀態"; }));
  document.querySelector("#reset-progress")?.addEventListener("click", () => { completedStages.clear(); writeProgress(); renderGuide(); bindEvents(); document.querySelector("#copy-status").textContent = "建置進度已重設"; });
}

renderGuide();
bindEvents();
