import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../utils/apiBase';
import { clearToken, getToken, setToken } from '../utils/auth';

// The backend has a single shared login. Public courses can optionally ship
// those credentials through NEXT_PUBLIC_TUTOR_EMAIL/PASSWORD so the panel
// signs in silently; otherwise it renders a compact inline login form.
const ENV_EMAIL = process.env.NEXT_PUBLIC_TUTOR_EMAIL;
const ENV_PASSWORD = process.env.NEXT_PUBLIC_TUTOR_PASSWORD;

type AuthStatus = 'checking' | 'ready' | 'error';

export function useTutorAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [error, setError] = useState('');
  const attemptedEnvLogin = useRef(false);

  const login = useCallback(async (email: string, password: string) => {
    setStatus('checking');
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Invalid email or password');
      const data = await response.json();
      setToken(data.token);
      setTokenState(data.token);
      setStatus('ready');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in');
      setStatus('error');
      return false;
    }
  }, []);

  useEffect(() => {
    const existing = getToken();
    if (existing) {
      // Hydrate the persisted token once on mount. This cannot move into a
      // render-time initializer without breaking hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTokenState(existing);
      setStatus('ready');
      return;
    }
    if (ENV_EMAIL && ENV_PASSWORD && !attemptedEnvLogin.current) {
      attemptedEnvLogin.current = true;
      void login(ENV_EMAIL, ENV_PASSWORD);
      return;
    }
    setStatus('ready');
  }, [login]);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setStatus('ready');
    setError('');
  }, []);

  return {
    token,
    status,
    error,
    needsLogin: status !== 'checking' && !token,
    checking: status === 'checking',
    login,
    logout,
  };
}
