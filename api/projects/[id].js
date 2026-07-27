const { supabase } = require('../_lib/supabase');

// Handles: GET /api/projects/:id, PUT /api/projects/:id, DELETE /api/projects/:id
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabase.from('projects').update(req.body).eq('id', id).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
};
