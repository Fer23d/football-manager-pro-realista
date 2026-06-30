const { createClient } = require('@supabase/supabase-js');

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function requireUser(req) {
  const token = getBearerToken(req);
  if (!token) {
    const err = new Error('Missing bearer token');
    err.statusCode = 401;
    throw err;
  }
  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) {
    const err = new Error('Invalid session');
    err.statusCode = 401;
    throw err;
  }
  return { admin, user: data.user };
}

function sendError(res, error) {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message || 'Server error' });
}

module.exports = { requireUser, sendError, supabaseAdmin };
