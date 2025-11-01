import { User } from '../models/User';
import BASE_URL from '../config';

export default class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const { payload, raw } = await AuthService.safeParseResponse(response);

      if (!response.ok) {
        console.warn('Login failed', payload ?? raw ?? response.statusText);
        return null;
      }

      const user = AuthService.mapToUser(payload, raw, email);
      if (!user) {
        console.warn('Login response missing expected fields', payload ?? raw);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Login error', error);
      return null;
    }
  }

  static async register(email: string, password: string, displayName: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password && displayName) {
      return {
        id: Date.now(),
        email,
        displayName,
        token: 'mock-token-signup'
      };
    }

    return null;
  }

  private static async safeParseResponse(response: Response): Promise<{ payload: any; raw: string | null }> {
    const raw = await response.text();
    if (!raw) {
      return { payload: null, raw: null };
    }

    try {
      return { payload: JSON.parse(raw), raw };
    } catch {
      console.warn('Login response is not JSON', raw);
      return { payload: null, raw };
    }
  }

  private static mapToUser(payload: any, raw: string | null, fallbackEmail: string): User | null {
    if (payload && typeof payload === 'object') {
      const container = payload.user ?? payload.data?.user ?? payload.data ?? payload;

      const idSource = container?.id ?? container?.userId ?? container?.uid ?? 0;
      const token =
        payload.token ??
        payload.data?.token ??
        container?.token ??
        (typeof raw === 'string' ? raw : null);

      if (!token) {
        return null;
      }

      return {
        id: Number.isFinite(Number(idSource)) ? Number(idSource) : 0,
        email: container?.email ?? container?.username ?? fallbackEmail,
        displayName: container?.displayName ?? container?.name ?? container?.username ?? fallbackEmail,
        token
      };
    }

    if (typeof payload === 'string' && payload.trim().length > 0) {
      return {
        id: 0,
        email: fallbackEmail,
        displayName: fallbackEmail,
        token: payload
      };
    }

    if (typeof raw === 'string' && raw.trim().length > 0) {
      return {
        id: 0,
        email: fallbackEmail,
        displayName: fallbackEmail,
        token: raw
      };
    }

    return null;
  }
}
