import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("template includes the six adapter actions", async () => {
  const demo = await readFile(new URL("src/services/demo-adapter.js", root), "utf8");
  for (const action of ["listRecords", "getRecord", "saveDecision", "createAction", "saveOutcome", "getHistory"]) {
    assert.match(demo, new RegExp(action));
  }
});

test("supabase schema protects both tables with row-level security", async () => {
  const schema = await readFile(new URL("supabase/schema.sql", root), "utf8");
  assert.match(schema, /alter table public\.work_items enable row level security/i);
  assert.match(schema, /alter table public\.work_events enable row level security/i);
  assert.match(schema, /auth\.uid\(\) = owner_id/i);
});

test("service role secret is not referenced by browser source", async () => {
  const files = ["src/main.js", "src/config.js", "src/services/supabase-adapter.js", ".env.example"];
  for (const file of files) {
    const content = await readFile(new URL(file, root), "utf8");
    assert.doesNotMatch(content, /service[_ -]?role/i, `${file} must not mention a service role key`);
  }
});

test("learner guide includes copyable case commands and safety boundaries", async () => {
  const guide = await readFile(new URL("src/guide.js", root), "utf8");
  for (const phrase of [
    "取得模板",
    "啟動本機系統",
    "客製自己的流程",
    "建立並操作三案例",
    "執行九項驗收",
    "最小範圍修復",
    "選配發布與手機驗證",
    "替換資料 adapter",
    "資料仍缺數量與需求日期，修改後採用",
    "尚未超過約定回覆時間，保留下次追蹤日期",
    "涉及特殊價格與交期，退回主管確認",
    "不得加入真實客戶資料",
    "失敗時怎麼做"
  ]) {
    assert.match(guide, new RegExp(phrase));
  }
  assert.match(guide, /data-copy/);
  assert.match(guide, /data-stage/);
  assert.match(guide, /aria-live="polite"/);
  assert.match(guide, /這個教學中心不需要登入或資料庫/);
  assert.match(guide, /listRecords/);
  assert.match(guide, /readback/);
});

test("vite build declares both workbench and learner guide entry pages", async () => {
  const config = await readFile(new URL("vite.config.js", root), "utf8");
  assert.match(config, /index\.html/);
  assert.match(config, /guide\.html/);
});
