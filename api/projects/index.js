const { supabase } = require('../_lib/supabase');

// Handles: GET /api/projects  and  POST /api/projects
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) return res.status(500).json({ message: error.message });
    const mapped = data.map(p => ({
      id: p.id, name: p.name, category: p.category, poc: p.poc, brandPoc: p.brand_poc,
      assignees: p.assignees, initiation: p.initiation_date, goLive: p.go_live_date,
      effort: p.effort, progress: p.progress, health: p.health
    }));
    return res.status(200).json(mapped);
  }

  if (req.method === 'POST') {
    const b = req.body;
    const payload = {
      name: b.name, category: b.category, poc: b.poc, brand_poc: b.brandPoc,
      assignees: b.assignees, initiation_date: b.initiation || null,
      go_live_date: b.goLive || null, effort: b.effort, progress: b.progress, health: b.health
    };
    const { data, error } = await supabase.from('projects').insert(payload).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json({
      id: data.id, name: data.name, category: data.category, poc: data.poc, brandPoc: data.brand_poc,
      assignees: data.assignees, initiation: data.initiation_date, goLive: data.go_live_date,
      effort: data.effort, progress: data.progress, health: data.health
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
};
