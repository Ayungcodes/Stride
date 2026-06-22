import { createClient } from "@/lib/supabase/client";

// ─── GET ALL CLIENTS ──────────────────────────────────────────
// Fetches clients with their projects so we can compute
// active/inactive status on the frontend.

export async function getClients() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      projects (
        id,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET SINGLE CLIENT ────────────────────────────────────────
export async function getClientById(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      projects (
        id,
        name,
        status,
        due_date,
        start_date
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── CREATE CLIENT ────────────────────────────────────────────
export async function createClient_(clientData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...clientData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── UPDATE CLIENT ────────────────────────────────────────────
export async function updateClient(id, updates) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── DELETE CLIENT ────────────────────────────────────────────
export async function deleteClient(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
