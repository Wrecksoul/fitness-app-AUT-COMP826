import { useState } from 'react';
import AuthService from '../services/AuthService';
import { User } from '../models/User';

export function useAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    onSuccess: (user: User) => void,
    onFailure?: () => void
  ) => {
    setLoading(true);
    setError(null);

    const user = await AuthService.login(email, password);

    if (user) {
      onSuccess(user);
    } else {
      setError('Invalid email or password');
      onFailure?.();
    }

    setLoading(false);
  };

  const signup = async (
    onSuccess: (user: User) => void,
    onFailure?: () => void
  ) => {
    setLoading(true);
    setError(null);

    const user = await AuthService.register(email, password);

    if (user) {
      onSuccess(user);
    } else {
      setError('Sign up failed');
      onFailure?.();
    }

    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login,
    signup
  };
}
