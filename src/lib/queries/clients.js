import { createClient } from "@/lib/supabase/client";

// ─── GET ALL CLIENTS ──────────────────────────────────────────
// Returns all clients belonging to the logged-in freelancer,
// newest first. RLS handles the user_id filter automatically.

export async function getClients() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET SINGLE CLIENT ────────────────────────────────────────
// Returns one client by ID, including all their linked projects.
// Useful for the client detail page (/clients/[id]).

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
    .single(); // returns one object instead of an array

  if (error) throw error;
  return data;
}

// ─── CREATE CLIENT ────────────────────────────────────────────
// Inserts a new client row. user_id is pulled from the active
// session so the freelancer can't spoof ownership.

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
// Updates specific fields on an existing client.
// Pass only the fields you want to change.

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
// Deletes a client. Their linked projects will have client_id
// set to NULL (ON DELETE SET NULL) — projects are not deleted.

export async function deleteClient(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
