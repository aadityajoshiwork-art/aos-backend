const { supabase } = require('../_lib/supabase');

// Handles: GET /api/approvals?projectId=
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('project_id', req.query.projectId);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: 'Method not allowed' });
};
