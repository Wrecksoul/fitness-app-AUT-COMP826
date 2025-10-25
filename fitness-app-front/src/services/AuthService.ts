import { User } from '../models/User';

export default class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    // simulate a delay like a real API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'test@foxmail.com' || password === '123456' || email ==='1') {
      return {
        id: 1,
        email,
        displayName: 'Demo User',
        token: 'mock-jwt-token'
      };
    }

    return null;
  }
    static async register(email: string, password: string, displayName: string): Promise<User | null> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Just return mock data for now
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
}