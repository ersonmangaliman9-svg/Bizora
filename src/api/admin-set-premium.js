// Vercel Serverless Function.
// Lets you grant or revoke Premium for any user by email, without logging
// into their account. Protected by ADMIN_PASSWORD, which lives only as a
// server-side environment variable — it's never sent to or stored in the
// browser, so it can't be read out of the deployed app's code.

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { adminPassword, email, premium } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Server is missing ADMIN_PASSWORD" });
  }
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong admin password" });
  }
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ is_premium: !!premium })
    .eq("email", email.trim())
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No account found with that email (they may not have finished setting up their business yet)." });
  }

  return res.status(200).json({ success: true, email, premium: !!premium });
}
