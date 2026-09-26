import { demoItems, initialEvents } from "../demo-data.js";

const STORAGE_KEY = "course-ai-workbench-v1";
const decisionLabels = { adopt: "採用", modify: "修改", defer: "延後", reject: "退回" };

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function initialState() {
  return { items: clone(demoItems), events: clone(initialEvents) };
}

function readState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState();
  } catch {
    return initialState();
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function addEvent(state, itemId, eventType, note) {
  const event = {
    id: crypto.randomUUID(),
    event_type: eventType,
    note,
    created_at: new Date().toISOString()
  };
  state.events[itemId] = [event, ...(state.events[itemId] || [])];
  return event;
}

export function createDemoAdapter() {
  return {
    mode: "demo",
    async listRecords() {
      return readState().items;
    },
    async getRecord(id) {
      return readState().items.find((item) => item.id === id) || null;
    },
    async getHistory(id) {
      return readState().events[id] || [];
    },
    async saveDecision(id, decision, note) {
      const state = readState();
      const item = state.items.find((entry) => entry.id === id);
      if (!item) throw new Error("找不到這筆資料");
      item.decision = decision;
      item.decision_note = note;
      item.updated_at = new Date().toISOString();
      addEvent(state, id, "decision", `人工決策：${decisionLabels[decision] || decision}${note ? `｜${note}` : ""}`);
      writeState(state);
      return item;
    },
    async createAction(id, action) {
      const state = readState();
      const item = state.items.find((entry) => entry.id === id);
      if (!item) throw new Error("找不到這筆資料");
      item.action = action;
      item.status = "in_progress";
      addEvent(state, id, "action", `建立任務：${action.title}｜到期 ${action.due_date}`);
      writeState(state);
      return item;
    },
    async saveOutcome(id, outcome) {
      const state = readState();
      const item = state.items.find((entry) => entry.id === id);
      if (!item) throw new Error("找不到這筆資料");
      item.outcome = outcome;
      item.status = outcome.status === "completed" ? "completed" : "waiting";
      item.next_contact = outcome.next_contact || item.next_contact;
      addEvent(state, id, "outcome", `執行結果：${outcome.note}`);
      writeState(state);
      return item;
    },
    async resetDemo() {
      writeState(initialState());
    }
  };
}
