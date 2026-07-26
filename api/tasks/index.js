const { supabase } = require('../_lib/supabase');

// Handles: GET /api/tasks?projectId=  or  GET /api/tasks?userId=
//          POST /api/tasks   (body must include project_id)
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    let query = supabase.from('tasks').select('*');
    if (req.query.projectId) query = query.eq('project_id', req.query.projectId);
    if (req.query.userId) query = query.eq('assignee_id', req.query.userId);
    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase.from('tasks').insert(req.body).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
};
