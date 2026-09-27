import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Single shared login (not a per-user directory): exactly one email/password
// pair, set via env and compared directly — env vars are trusted config,
// not user-submitted secrets, so no hashing needed here.
const AUTH_EMAIL = process.env.AUTH_EMAIL || '';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';

// IMPORTANT (serverless-specific): unlike a long-running server, Vercel can
// run this module fresh on multiple concurrent function instances. If
// JWT_SECRET isn't set, each instance falls back to its OWN random secret —
// meaning a token signed by one instance can fail verification on another,
// causing intermittent "Invalid or expired token" errors. Treat JWT_SECRET
// as required in production, not just recommended.
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn(
    'JWT_SECRET is not set. Falling back to a random per-instance secret — ' +
    'on Vercel this WILL cause intermittent auth failures across cold starts/instances. Set JWT_SECRET.'
  );
}

type AuthResult = { ok: true } | { ok: false; status: number; error: string };

export function checkCredentials(email: string, password: string): AuthResult {
  if (!AUTH_EMAIL || !AUTH_PASSWORD) {
    return { ok: false, status: 503, error: 'Login is not configured on this server' };
  }
  if (email !== AUTH_EMAIL || password !== AUTH_PASSWORD) {
    return { ok: false, status: 401, error: 'Invalid credentials' };
  }
  return { ok: true };
}

export function signToken(email: string): string {
  return jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req: Request): AuthResult {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: 'Missing bearer token' };
  try {
    jwt.verify(token, JWT_SECRET);
    return { ok: true };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired token' };
  }
}
