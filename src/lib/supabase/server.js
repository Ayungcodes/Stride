import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// This creates a Supabase client for use on the server.
// Call this inside Server Components, Server Actions, or Route Handlers.
// It reads the session from the request cookies — not the browser.

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read a cookie by name
        get(name) {
          return cookieStore.get(name)?.value;
        },
        // Write a cookie
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        // Delete a cookie
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
