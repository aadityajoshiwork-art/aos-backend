const { supabase } = require('../_lib/supabase');

// Handles: GET /api/teams  — returns each team with its members nested
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('teams')
      .select('*, members:team_members(member:members(*))');
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: 'Method not allowed' });
};
