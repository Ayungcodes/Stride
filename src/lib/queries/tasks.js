import { createClient } from "@/lib/supabase/client";

// ─── GET ALL TASKS ────────────────────────────────────────────
// Returns all tasks for the logged-in freelancer.
// Fetches the linked project name if one exists (nullable).

export async function getTasks() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET TASKS BY PROJECT ─────────────────────────────────────
// Returns all tasks linked to a specific project.
// Used on the project detail page.

export async function getTasksByProject(projectId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET STANDALONE TASKS ─────────────────────────────────────
// Returns only tasks that are NOT linked to any project.
// Useful for a "personal to-dos" section on the dashboard.

export async function getStandaloneTasks() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .is("project_id", null) // project_id IS NULL
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET SINGLE TASK ──────────────────────────────────────────

export async function getTaskById(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── CREATE TASK ──────────────────────────────────────────────
// project_id is optional. Pass it if the task belongs to a project,
// leave it out (or pass null) for a standalone task.

export async function createTask(taskData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...taskData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── UPDATE TASK ──────────────────────────────────────────────
// Commonly used to update status: todo → in_progress → done.

export async function updateTask(id, updates) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── DELETE TASK ──────────────────────────────────────────────

export async function deleteTask(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
