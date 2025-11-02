import { useCallback, useEffect, useState } from "react";
import RouteService from "../services/RouteService";
import { Route } from "../models/Route";
import { CheckIn } from "../models/CheckIn";

export interface HistoryEntry {
  id: string;
  routeId: string;
  routeName: string;
  startedAt: string;
  completedAt: string;
  checkpoints: Array<{ id: string | null; checkedAt: string }>;
}

export function useHistoryViewModel(username: string | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!username) {
      setEntries([]);
      setError("Please log in to view your history.");
      setUnauthorized(false);
      return;
    }

    setLoading(true);
    setError(null);
    setUnauthorized(false);

    const routesResult = await RouteService.getRoutes();
    if (routesResult.unauthorized) {
      setEntries([]);
      setUnauthorized(true);
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const routes = routesResult.data ?? [];
    if (routes.length === 0) {
      setEntries([]);
      setError("No routes available.");
      setLoading(false);
      return;
    }

    const collected: HistoryEntry[] = [];

    for (const route of routes) {
      const checkInsResult = await RouteService.getCheckIns(route.id, username);
      if (checkInsResult.unauthorized) {
        setEntries([]);
        setUnauthorized(true);
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const checkIns = checkInsResult.data ?? [];
      if (checkIns.length === 0) {
        continue;
      }

      const grouped = groupCheckIns(checkIns).map((group) => mapToHistoryEntry(group, route));
      collected.push(...grouped);
    }

    collected.sort((a, b) => {
      const aTime = new Date(a.completedAt).getTime();
      const bTime = new Date(b.completedAt).getTime();
      return bTime - aTime;
    });

    setEntries(collected);
    setLoading(false);
  }, [username]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { entries, loading, error, unauthorized, refresh: loadHistory };
}

type CheckInGroup = {
  key: string;
  routeId: string;
  username: string;
  checkpoints: CheckIn[];
};

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function groupCheckIns(checkIns: CheckIn[]): CheckInGroup[] {
  if (checkIns.length === 0) {
    return [];
  }

  const sorted = [...checkIns].sort((a, b) => {
    const aTime = new Date(a.checkedAt).getTime();
    const bTime = new Date(b.checkedAt).getTime();
    return aTime - bTime;
  });

  const groups: CheckInGroup[] = [];
  let currentGroup: CheckInGroup | null = null;

  sorted.forEach((checkIn, index) => {
    const timestamp = new Date(checkIn.checkedAt).getTime();

    if (!currentGroup) {
      currentGroup = {
        key: `${checkIn.routeId}-${checkIn.username}-${timestamp}`,
        routeId: checkIn.routeId,
        username: checkIn.username,
        checkpoints: [checkIn],
      };
      groups.push(currentGroup);
      return;
    }

    const lastCheckpoint = currentGroup.checkpoints[currentGroup.checkpoints.length - 1];
    const lastTime = new Date(lastCheckpoint.checkedAt).getTime();

    if (timestamp - lastTime <= FIFTEEN_MINUTES_MS) {
      currentGroup.checkpoints.push(checkIn);
    } else {
      currentGroup = {
        key: `${checkIn.routeId}-${checkIn.username}-${timestamp}`,
        routeId: checkIn.routeId,
        username: checkIn.username,
        checkpoints: [checkIn],
      };
      groups.push(currentGroup);
    }
  });

  return groups;
}

function mapToHistoryEntry(group: CheckInGroup, route: Route): HistoryEntry {
  const checkpoints = group.checkpoints.map((checkIn) => ({
    id: checkIn.checkpointId,
    checkedAt: checkIn.checkedAt,
  }));

  const startedAt = checkpoints[0]?.checkedAt ?? new Date().toISOString();
  const completedAt = checkpoints[checkpoints.length - 1]?.checkedAt ?? startedAt;

  return {
    id: group.key,
    routeId: route.id,
    routeName: route.name,
    startedAt,
    completedAt,
    checkpoints,
  };
}
