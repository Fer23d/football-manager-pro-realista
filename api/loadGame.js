const { requireUser, sendError } = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { admin, user } = await requireUser(req);
    const { data, error } = await admin
      .from('game_saves')
      .select('save_data, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'No save found' });
    res.status(200).json(data);
  } catch (error) {
    sendError(res, error);
  }
};
