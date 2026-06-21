import { createClient } from "@/lib/supabase/client";

// ─── GET MONTHLY EARNINGS ─────────────────────────────────────
// Returns total earnings grouped by month for a given year.
// This is what powers the analytics graph.
// e.g. getEarningsByYear(2025) → [ { month: 1, total: 450000 }, ... ]

export async function getEarningsByYear(year) {
  const supabase = createClient();

  // Query the monthly_earnings view we created in migration 005
  const { data, error } = await supabase
    .from("monthly_earnings")
    .select("month, month_start, total, entry_count")
    .eq("year", year)
    .order("month", { ascending: true });

  if (error) throw error;
  return data;
}

// ─── GET EARNINGS FOR A SPECIFIC MONTH ───────────────────────
// Returns all individual earning entries for a given month/year.
// Used when a user clicks a month to see the breakdown.
// month is 1-indexed (1 = January, 12 = December)

export async function getEarningsByMonth(year, month) {
  const supabase = createClient();

  // Build the first and last day of the requested month
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const to = new Date(year, month, 0).toISOString().split("T")[0]; // last day

  const { data, error } = await supabase
    .from("earnings")
    .select(`
      *,
      projects (
        id,
        name
      )
    `)
    .gte("date", from) // date >= first day
    .lte("date", to)   // date <= last day
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// ─── GET AVAILABLE YEARS ──────────────────────────────────────
// Returns a list of distinct years that have earnings entries.
// Used to populate a year selector on the analytics page.

export async function getEarningYears() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("earnings")
    .select("date");

  if (error) throw error;

  // Extract unique years from the date column
  const years = [...new Set(data.map((e) => new Date(e.date).getFullYear()))];
  return years.sort((a, b) => b - a); // newest year first
}

// ─── ADD EARNING ──────────────────────────────────────────────
// Logs a new earning entry. project_id is optional.

export async function createEarning(earningData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("earnings")
    .insert({ ...earningData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── UPDATE EARNING ───────────────────────────────────────────

export async function updateEarning(id, updates) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("earnings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── DELETE EARNING ───────────────────────────────────────────

export async function deleteEarning(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("earnings")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
