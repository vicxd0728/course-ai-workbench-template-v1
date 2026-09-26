import "./styles.css";
import { workflowConfig, hasSupabaseConfig } from "./config.js";
import { createDemoAdapter } from "./services/demo-adapter.js";
import { createSupabaseAdapter } from "./services/supabase-adapter.js";

const configured = hasSupabaseConfig();
const adapter = configured
  ? createSupabaseAdapter(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  : createDemoAdapter();

const state = {
  user: null,
  items: [],
  selectedId: null,
  history: [],
  loading: true,
  message: "",
  messageTone: "info"
};

const app = document.querySelector("#app");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectedItem() {
  return state.items.find((item) => item.id === state.selectedId) || state.items[0] || null;
}

function formatDate(value) {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("zh-TW", { month: "numeric", day: "numeric" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function setMessage(message, tone = "info") {
  state.message = message;
  state.messageTone = tone;
  render();
  window.setTimeout(() => {
    if (state.message === message) {
      state.message = "";
      render();
    }
  }, 3600);
}

async function loadData(preferredId) {
  state.loading = true;
  render();
  try {
    if (configured) await adapter.seedIfEmpty();
    state.items = await adapter.listRecords();
    state.selectedId = preferredId || state.selectedId || state.items[0]?.id || null;
    state.history = state.selectedId ? await adapter.getHistory(state.selectedId) : [];
  } catch (error) {
    setMessage(error.message || "資料載入失敗", "danger");
  } finally {
    state.loading = false;
    render();
  }
}

function loginView() {
  return `
    <main class="login-shell">
      <section class="login-card">
        <div class="brand-mark" aria-hidden="true">AI</div>
        <p class="eyebrow">課程模板｜個人雲端工作區</p>
        <h1>${workflowConfig.appName}</h1>
        <p class="login-copy">輸入課前登記的 Email。我們會寄送登入連結，登入後才能讀取你的工作資料。</p>
        <form id="login-form" class="stack-form">
          <label for="login-email">Email</label>
          <input id="login-email" name="email" type="email" autocomplete="email" placeholder="name@company.com" required />
          <button class="primary-button" type="submit">寄送登入連結</button>
        </form>
        <p class="privacy-note">課堂只使用去識別化資料。請勿輸入正式客戶、價格或未公開資訊。</p>
      </section>
    </main>`;
}

function headerView() {
  const modeLabel = configured ? "雲端模式" : "範例模式";
  return `
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-mark small" aria-hidden="true">AI</div>
        <div>
          <p class="eyebrow">${modeLabel}</p>
          <h1>${workflowConfig.appName}</h1>
        </div>
      </div>
      <div class="topbar-actions">
        <nav class="course-nav" aria-label="課堂頁面">
          <a class="active" href="./" aria-current="page">操作練習</a>
          <a href="./guide.html">建置控制台</a>
        </nav>
        <span class="mode-badge ${configured ? "cloud" : "demo"}">${configured ? "跨裝置同步" : "本機練習"}</span>
        ${configured ? `<button class="ghost-button" data-action="signout">登出</button>` : `<button class="ghost-button" data-action="reset">重設範例</button>`}
      </div>
    </header>`;
}

function listView() {
  if (state.loading) return `<section class="panel list-panel"><div class="skeleton-block"></div><div class="skeleton-block"></div></section>`;
  if (!state.items.length) return `<section class="panel list-panel empty-state"><h2>目前沒有資料</h2><p>先加入一筆去識別化工作資料。</p></section>`;
  return `
    <section class="panel list-panel" aria-label="${workflowConfig.listTitle}">
      <div class="panel-heading">
        <div><p class="eyebrow">WORK QUEUE</p><h2>${workflowConfig.listTitle}</h2></div>
        <span class="count-badge">${state.items.length}</span>
      </div>
      <div class="filter-row" aria-label="快速篩選">
        <button class="filter active" type="button">全部</button>
        <button class="filter" type="button">P0／P1</button>
        <button class="filter" type="button">到期</button>
      </div>
      <div class="work-list">
        ${state.items.map((item) => `
          <button class="work-card ${item.id === state.selectedId ? "selected" : ""}" data-select-id="${item.id}" type="button">
            <span class="priority ${item.priority.toLowerCase()}">${item.priority}</span>
            <span class="work-main">
              <strong>${escapeHtml(item.customer_name)}</strong>
              <span>${escapeHtml(item.stage)} · ${escapeHtml(item.country)}</span>
            </span>
            <span class="due">${formatDate(item.next_contact)}</span>
          </button>`).join("")}
      </div>
    </section>`;
}

function detailView(item) {
  if (!item) return `<section class="panel empty-state"><h2>選擇一筆資料</h2></section>`;
  return `
    <section class="panel detail-panel">
      <div class="detail-title">
        <div>
          <p class="eyebrow">CUSTOMER 360</p>
          <h2>${escapeHtml(item.customer_name)}</h2>
        </div>
        <span class="stage-badge">${escapeHtml(item.stage)}</span>
      </div>
      <div class="summary-box">${escapeHtml(item.summary)}</div>
      <dl class="field-grid">
        ${workflowConfig.fields.map((field) => `
          <div><dt>${field.label}</dt><dd>${field.key.includes("contact") ? formatDate(item[field.key]) : escapeHtml(item[field.key] || "未填")}</dd></div>`).join("")}
      </dl>
      <div class="timeline-heading"><h3>活動時間線</h3><span>${state.history.length} 筆</span></div>
      <ol class="timeline">
        ${state.history.length ? state.history.map((event) => `
          <li>
            <span class="timeline-dot ${escapeHtml(event.event_type)}"></span>
            <div><strong>${escapeHtml(event.note)}</strong><time>${formatDateTime(event.created_at)}</time></div>
          </li>`).join("") : `<li class="muted">尚無活動紀錄</li>`}
      </ol>
    </section>`;
}

function recommendationView(item) {
  if (!item) return "";
  const rec = item.recommendation || {};
  return `
    <section class="panel action-panel">
      <div class="recommendation-head">
        <div><p class="eyebrow">AI RECOMMENDATION</p><h2>建議與人工判斷</h2></div>
        <span class="priority large ${item.priority.toLowerCase()}">${item.priority}</span>
      </div>
      <div class="recommendation-grid">
        <div><span>依據</span><p>${escapeHtml(rec.evidence || "尚無足夠依據")}</p></div>
        <div><span>下一步</span><p>${escapeHtml(rec.next_action || "請人工補充")}</p></div>
        <div class="risk"><span>風險</span><p>${escapeHtml(rec.risk || "尚未識別")}</p></div>
      </div>
      ${(rec.missing || []).length ? `<div class="missing-row"><strong>待補資料</strong>${rec.missing.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>` : ""}

      <form id="decision-form" class="action-section">
        <div class="section-label"><h3>1. 人工決策</h3><span>AI 不會直接執行</span></div>
        <div class="decision-buttons">
          ${workflowConfig.decisions.map((decision) => `
            <button type="button" class="decision-button ${decision.tone} ${item.decision === decision.id ? "chosen" : ""}" data-decision="${decision.id}">${decision.label}</button>`).join("")}
        </div>
        <label for="decision-note">判斷理由</label>
        <textarea id="decision-note" name="note" rows="2" placeholder="例如：資料仍缺交期，先修改後再採用">${escapeHtml(item.decision_note || "")}</textarea>
      </form>

      <form id="action-form" class="action-section">
        <div class="section-label"><h3>2. 建立任務</h3><span>把決策變成行動</span></div>
        <label for="action-title">任務內容</label>
        <input id="action-title" name="title" value="${escapeHtml(item.action?.title || rec.next_action || "")}" required />
        <label for="action-date">到期日</label>
        <input id="action-date" name="due_date" type="date" value="${escapeHtml(item.action?.due_date || item.next_contact || "")}" required />
        <button class="primary-button" type="submit">儲存任務</button>
      </form>

      <form id="outcome-form" class="action-section">
        <div class="section-label"><h3>3. 記錄結果</h3><span>成為下一輪依據</span></div>
        <label for="outcome-note">執行結果</label>
        <textarea id="outcome-note" name="note" rows="3" placeholder="例如：已寄出詢問，等待客戶確認數量" required>${escapeHtml(item.outcome?.note || "")}</textarea>
        <div class="split-fields">
          <div><label for="outcome-status">結果狀態</label><select id="outcome-status" name="status"><option value="waiting">等待後續</option><option value="completed">完成</option></select></div>
          <div><label for="next-contact">下次日期</label><input id="next-contact" name="next_contact" type="date" value="${escapeHtml(item.next_contact || "")}" /></div>
        </div>
        <button class="secondary-button" type="submit">儲存結果並回到歷史</button>
      </form>
    </section>`;
}

function workspaceView() {
  const item = selectedItem();
  return `
    ${headerView()}
    ${state.message ? `<div class="toast ${state.messageTone}" role="status">${escapeHtml(state.message)}</div>` : ""}
    ${!configured ? `<div class="demo-banner"><strong>目前是範例模式。</strong>決策會保存在這台裝置；加入 Supabase 設定後才會跨裝置同步。</div>` : ""}
    <main class="workspace">
      ${listView()}
      ${detailView(item)}
      ${recommendationView(item)}
    </main>`;
}

function render() {
  if (configured && !state.user) {
    app.innerHTML = loginView();
  } else {
    app.innerHTML = workspaceView();
  }
  bindEvents();
}

function bindEvents() {
  document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    try {
      await adapter.sendLogin(email);
      setMessage("登入連結已寄出，請到信箱完成登入。", "success");
    } catch (error) {
      setMessage(error.message || "登入連結寄送失敗", "danger");
    }
  });

  document.querySelectorAll("[data-select-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedId = button.dataset.selectId;
      state.history = await adapter.getHistory(state.selectedId);
      render();
      if (window.innerWidth < 900) document.querySelector(".detail-panel")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-decision]").forEach((button) => {
    button.addEventListener("click", async () => {
      const note = document.querySelector("#decision-note")?.value.trim() || "";
      try {
        await adapter.saveDecision(state.selectedId, button.dataset.decision, note);
        await loadData(state.selectedId);
        setMessage(`已記錄人工決策：${button.textContent}`, "success");
      } catch (error) {
        setMessage(error.message || "決策儲存失敗", "danger");
      }
    });
  });

  document.querySelector("#action-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await adapter.createAction(state.selectedId, { title: form.get("title"), due_date: form.get("due_date") });
      await loadData(state.selectedId);
      setMessage("任務已建立並寫入時間線。", "success");
    } catch (error) {
      setMessage(error.message || "任務儲存失敗", "danger");
    }
  });

  document.querySelector("#outcome-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await adapter.saveOutcome(state.selectedId, {
        note: form.get("note"),
        status: form.get("status"),
        next_contact: form.get("next_contact")
      });
      await loadData(state.selectedId);
      setMessage("結果已保存，並成為下一輪分析依據。", "success");
    } catch (error) {
      setMessage(error.message || "結果儲存失敗", "danger");
    }
  });

  document.querySelector('[data-action="reset"]')?.addEventListener("click", async () => {
    await adapter.resetDemo();
    await loadData("demo-1");
    setMessage("範例資料已重設。", "success");
  });

  document.querySelector('[data-action="signout"]')?.addEventListener("click", async () => {
    await adapter.signOut();
  });
}

async function start() {
  if (configured) {
    state.user = await adapter.currentUser();
    adapter.onAuthChange(async (user) => {
      state.user = user;
      if (user) await loadData();
      else render();
    });
    if (state.user) await loadData();
    else {
      state.loading = false;
      render();
    }
  } else {
    state.user = { id: "demo-user" };
    await loadData();
  }
}

start();
