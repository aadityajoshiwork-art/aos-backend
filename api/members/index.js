const { supabase } = require('../_lib/supabase');

// Handles: GET /api/members   and   POST /api/members  (invite a new member)
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('members').select('*');
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase.from('members').insert(req.body).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
};
