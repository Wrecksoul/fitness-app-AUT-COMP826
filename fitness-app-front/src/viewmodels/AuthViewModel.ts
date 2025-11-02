import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';
import { User } from '../models/User';
import { AUTH_USER_KEY } from '../constants/storageKeys';

export function useAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const persistUser = useCallback(async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (storageError) {
      console.error('Persist auth error', storageError);
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setCurrentUser(parsed);
        }
      } catch (storageError) {
        console.error('Restore auth error', storageError);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (
    onSuccess: (user: User) => void,
    onFailure?: () => void
  ) => {
    setLoading(true);
    setError(null);

    const user = await AuthService.login(email, password);

    if (user) {
      setCurrentUser(user);
      await persistUser(user);
      onSuccess(user);
    } else {
      setError('Invalid email or password');
      onFailure?.();
    }

    setLoading(false);
  }, [email, password, persistUser]);

  const signup = useCallback(async (
    onSuccess: (user: User) => void,
    onFailure?: () => void
  ) => {
    setLoading(true);
    setError(null);

    const user = await AuthService.register(email, password);

    if (user) {
      setCurrentUser(user);
      await persistUser(user);
      onSuccess(user);
    } else {
      setError('Sign up failed');
      onFailure?.();
    }

    setLoading(false);
  }, [email, password, persistUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    setCurrentUser(null);
    setEmail('');
    setPassword('');

    await persistUser(null);

    setLoading(false);
  }, [persistUser]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    currentUser,
    initializing,
    login,
    signup,
    logout
  };
}
