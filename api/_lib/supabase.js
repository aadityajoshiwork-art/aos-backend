// Shared Supabase connection. Every file in /api imports this instead of
// creating its own connection. Reads the URL + key from Vercel's
// Environment Variables (Project Settings → Environment Variables) —
// never paste real keys directly into this file.
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = { supabase };
