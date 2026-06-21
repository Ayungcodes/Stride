// ─── PRIORITY CALCULATOR ─────────────────────────────────────────────
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

// Priority badge colors
export const priorityStyles = {
  overdue: "bg-red-100 text-red-700",
  urgent:  "bg-orange-100 text-orange-700",
  high:    "bg-yellow-100 text-yellow-700",
  medium:  "bg-blue-100 text-blue-700",
  low:     "bg-green-100 text-green-700",
  none:    "bg-gray-100 text-gray-500",
};

// ─── DATE FORMATTER ─────────────────────────────────────────────
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


// ─── CURRENCY FORMATTER ─────────────────────────────────────────
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

// ─── MONTH NAME FORMATTER ───────────────────────────────────────
export function getMonthName(month) {
  return new Date(2000, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });
}

// ─── INITIALS GENERATOR ─────────────────────────────────────────
export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
