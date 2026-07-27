const { supabase } = require('../_lib/supabase');

// Handles: PUT /api/tasks/:id, DELETE /api/tasks/:id
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { data, error } = await supabase.from('tasks').update(req.body).eq('id', id).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
};
