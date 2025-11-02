// src/viewmodels/RoutesViewModel.ts

import { useCallback, useEffect, useState } from "react";
import { Route } from "../models/Route";
import RouteService from "../services/RouteService";

export const useRoutesViewModel = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthorized(false);

    const result = await RouteService.getRoutes();

    if (result.unauthorized) {
      setRoutes([]);
      setUnauthorized(true);
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchedRoutes = result.data ?? [];
    setRoutes(fetchedRoutes);
    if (fetchedRoutes.length === 0) {
      setError("No routes available");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  return { routes, loading, error, unauthorized, refresh: loadRoutes };
};
