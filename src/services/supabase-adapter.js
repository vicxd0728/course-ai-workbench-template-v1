import { createClient } from "@supabase/supabase-js";
import { demoItems } from "../demo-data.js";

const decisionLabels = { adopt: "採用", modify: "修改", defer: "延後", reject: "退回" };

export function createSupabaseAdapter(url, publishableKey) {
  const client = createClient(url, publishableKey);

  async function getUser() {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async function addEvent(workItemId, eventType, note, payload = {}) {
    const user = await getUser();
    if (!user) throw new Error("請先登入");
    const { error } = await client.from("work_events").insert({
      work_item_id: workItemId,
      owner_id: user.id,
      event_type: eventType,
      note,
      payload
    });
    if (error) throw error;
  }

  return {
    mode: "supabase",
    client,
    async currentUser() {
      return getUser();
    },
    async sendLogin(email) {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
    onAuthChange(callback) {
      return client.auth.onAuthStateChange((_event, session) => callback(session?.user || null));
    },
    async seedIfEmpty() {
      const user = await getUser();
      if (!user) return;
      const { count, error: countError } = await client
        .from("work_items")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      if (count) return;
      const rows = demoItems.map(({ id: _id, recommendation, ...item }) => ({
        ...item,
        owner_id: user.id,
        recommendation
      }));
      const { error } = await client.from("work_items").insert(rows);
      if (error) throw error;
    },
    async listRecords() {
      const { data, error } = await client
        .from("work_items")
        .select("*")
        .order("priority", { ascending: true })
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async getRecord(id) {
      const { data, error } = await client.from("work_items").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    async getHistory(id) {
      const { data, error } = await client
        .from("work_events")
        .select("*")
        .eq("work_item_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async saveDecision(id, decision, note) {
      const { data, error } = await client
        .from("work_items")
        .update({ decision, decision_note: note, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await addEvent(id, "decision", `人工決策：${decisionLabels[decision] || decision}${note ? `｜${note}` : ""}`);
      return data;
    },
    async createAction(id, action) {
      const { data, error } = await client
        .from("work_items")
        .update({ action, status: "in_progress", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await addEvent(id, "action", `建立任務：${action.title}｜到期 ${action.due_date}`, action);
      return data;
    },
    async saveOutcome(id, outcome) {
      const { data, error } = await client
        .from("work_items")
        .update({
          outcome,
          status: outcome.status === "completed" ? "completed" : "waiting",
          next_contact: outcome.next_contact || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await addEvent(id, "outcome", `執行結果：${outcome.note}`, outcome);
      return data;
    }
  };
}
