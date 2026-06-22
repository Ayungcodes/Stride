// ─── PRIORITY ─────────────────────────────────────────────────
// Computes project priority from due_date.
// Called in useProjects — never stored in the DB.
//
// Returns: "urgent" | "high" | "medium" | "low" | "none"

export function getPriority(dueDate) {
  if (!dueDate) return "none";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0)  return "overdue";
  if (daysLeft <= 3) return "urgent";
  if (daysLeft <= 7) return "high";
  if (daysLeft <= 14) return "medium";
  return "low";
}

// Priority badge colors — use in your components
export const priorityStyles = {
  overdue: "bg-red-100 text-red-700",
  urgent:  "bg-orange-100 text-orange-700",
  high:    "bg-yellow-100 text-yellow-700",
  medium:  "bg-blue-100 text-blue-700",
  low:     "bg-green-100 text-green-700",
  none:    "bg-gray-100 text-gray-500",
};

// ─── DATE ─────────────────────────────────────────────────────
// Formats a date string into a readable format.
// e.g. "2025-06-21" → "Jun 21, 2025"

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── CURRENCY ─────────────────────────────────────────────────
// Formats a number as currency.
// e.g. 450000 → "₦450,000.00"
// Change the locale and currency to match your preference.

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

// ─── MONTH NAME ───────────────────────────────────────────────
// Converts a month number to its name.
// e.g. 6 → "June"

export function getMonthName(month) {
  return new Date(2000, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });
}

// ─── INITIALS ─────────────────────────────────────────────────
// Gets initials from a full name for avatar placeholders.
// e.g. "John Doe" → "JD"

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── CLIENT STATUS ────────────────────────────────────────────
// Derives active/inactive from whether the client has any
// projects with status "active". No DB column needed.
//
// e.g. getClientStatus(client.projects) → "active" | "inactive"

export function getClientStatus(projects = []) {
  const hasActiveProject = projects.some((p) => p.status === "active");
  return hasActiveProject ? "active" : "inactive";
}
