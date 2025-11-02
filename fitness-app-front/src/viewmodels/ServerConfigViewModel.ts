import { useCallback, useEffect, useState } from 'react';
import {
  getServerIp,
  initializeServerConfig,
  isValidIp,
  setServerIp
} from '../config';

export function useServerConfigViewModel() {
  const [serverIp, setServerIpState] = useState(getServerIp());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const ip = await initializeServerConfig();
      if (isMounted) {
        setServerIpState(ip);
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateServerIp = useCallback(async (ip: string) => {
    if (!isValidIp(ip)) {
      setError('Please enter a valid IPv4 address');
      return false;
    }

    try {
      await setServerIp(ip);
      setServerIpState(ip);
      setError(null);
      return true;
    } catch (updateError) {
      console.error('Failed to update server IP', updateError);
      setError('Failed to save server address');
      return false;
    }
  }, []);

  return {
    serverIp,
    loading,
    error,
    updateServerIp,
    validateIp: isValidIp
  };
}
