import { createClient } from "@supabase/supabase-js";

// These come from Vercel Environment Variables. VITE_ prefix is required
// by Vite to expose them to the browser.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If either is missing, DON'T call createClient (it throws and used to take
// the whole app down to a blank screen). Instead export null + a flag, and
// App.jsx shows a friendly "setup needed" screen with exactly what's missing.
export const supabaseReady = !!(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseReady ? createClient(supabaseUrl, supabaseAnonKey) : null;
