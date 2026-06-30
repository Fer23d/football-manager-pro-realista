const { requireUser, sendError } = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { admin, user } = await requireUser(req);
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const saveData = body.save_data || body.state || body;
    await admin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        username: saveData?.account?.username || user.user_metadata?.username || user.email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    const { data, error } = await admin
      .from('game_saves')
      .upsert({ user_id: user.id, save_data: saveData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select('id, user_id, updated_at')
      .single();
    if (error) throw error;
    res.status(200).json({ ok: true, save: data });
  } catch (error) {
    sendError(res, error);
  }
};
