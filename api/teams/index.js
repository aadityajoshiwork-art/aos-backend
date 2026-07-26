const { supabase } = require('../_lib/supabase');

// Handles: GET /api/teams  — returns each team with its members nested
module.exports = async (req, res) => {
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
