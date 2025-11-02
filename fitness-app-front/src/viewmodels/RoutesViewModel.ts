// src/viewmodels/RoutesViewModel.ts

import { useCallback, useEffect, useState } from "react";
import { Route } from "../models/Route";
import RouteService from "../services/RouteService";

export const useRoutesViewModel = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const fetchedRoutes = await RouteService.getRoutes();
    if (fetchedRoutes) {
      setRoutes(fetchedRoutes);
      if (fetchedRoutes.length === 0) {
        setError("No routes available");
      }
    } else {
      setRoutes([]);
      setError("Failed to load routes");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  return { routes, loading, error, refresh: loadRoutes };
};
