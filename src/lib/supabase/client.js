import { createBrowserClient } from "@supabase/ssr";

// This creates a single Supabase client for use in the browser.
// Call this function inside any "use client" component.
// It reads the session from the browser's cookies automatically.

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
