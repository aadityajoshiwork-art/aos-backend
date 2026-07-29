const { supabase } = require('../_lib/supabase');

// Handles: PUT /api/approvals/:id   body: { status: 'approved' | 'changes_requested' | 'rejected' }
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('approvals')
      .update({ status: req.body.status })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['PUT']);
  return res.status(405).json({ message: 'Method not allowed' });
};
