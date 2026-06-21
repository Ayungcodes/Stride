import { createClient } from "@/lib/supabase/client";

// ─── GET ALL PROJECTS ─────────────────────────────────────────
// Returns all projects for the logged-in freelancer.
// Also fetches the linked client's name so you can display
// "Project X — Client Y" without a second query.

export async function getProjects() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET PROJECTS BY CLIENT ───────────────────────────────────
// Returns all projects linked to a specific client.
// Used on the client detail page.

export async function getProjectsByClient(clientId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true }); // soonest due first

  if (error) throw error;
  return data;
}

// ─── GET SINGLE PROJECT ───────────────────────────────────────
// Returns one project by ID, with its linked client and tasks.
// Used on the project detail page (/projects/[id]).

export async function getProjectById(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (
        id,
        name,
        email
      ),
      tasks (
        id,
        title,
        status,
        due_date
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── CREATE PROJECT ───────────────────────────────────────────
// Inserts a new project. client_id is optional — pass null
// if the project isn't linked to a client.

export async function createProject(projectData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...projectData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── UPDATE PROJECT ───────────────────────────────────────────
// Updates specific fields on an existing project.
// Commonly used to change status: active → completed → on_hold.

export async function updateProject(id, updates) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── DELETE PROJECT ───────────────────────────────────────────
// Deletes a project. Linked tasks will have project_id set
// to NULL (ON DELETE SET NULL) — tasks are not deleted.

export async function deleteProject(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
