import BASE_URL from '../config';
import { Route } from '../models/Route';

type ParsedResponse = {
  payload: unknown;
  raw: string | null;
};

export default class RouteService {
  private static readonly ROUTES_ENDPOINT = `${BASE_URL}/routes`;

  static async getRoutes(): Promise<Route[] | null> {
    try {
      const response = await fetch(RouteService.ROUTES_ENDPOINT);
      const { payload, raw } = await RouteService.parseResponse(response);

      if (!response.ok) {
        console.warn('Failed to fetch routes', payload ?? raw ?? response.statusText);
        return null;
      }

      if (!Array.isArray(payload)) {
        console.warn('Unexpected routes payload', payload ?? raw);
        return null;
      }

      return payload
        .map(RouteService.mapToRoute)
        .filter((route): route is Route => route !== null);
    } catch (error) {
      console.error('Routes fetch error', error);
      return null;
    }
  }

  static async getRoute(routeId: string): Promise<Route | null> {
    if (!routeId) {
      return null;
    }

    try {
      const response = await fetch(`${RouteService.ROUTES_ENDPOINT}/${routeId}`);
      const { payload, raw } = await RouteService.parseResponse(response);

      if (response.ok) {
        const route = RouteService.mapToRoute(payload);
        if (route) {
          return route;
        }
      } else {
        console.warn('Failed to fetch route', routeId, payload ?? raw ?? response.statusText);
      }
    } catch (error) {
      console.error('Route fetch error', error);
    }

    const routes = await RouteService.getRoutes();
    if (!routes) {
      return null;
    }

    return routes.find((route) => route.id === routeId) ?? null;
  }

  private static async parseResponse(response: Response): Promise<ParsedResponse> {
    const raw = await response.text();
    if (!raw) {
      return { payload: null, raw: null };
    }

    try {
      return { payload: JSON.parse(raw), raw };
    } catch {
      console.warn('Routes response is not JSON', raw);
      return { payload: null, raw };
    }
  }

  private static mapToRoute(payload: any): Route | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const id = payload.id ?? payload.routeId ?? payload.uuid;
    if (!id) {
      return null;
    }

    const checkpointsSource = Array.isArray(payload.checkpoints)
      ? payload.checkpoints
      : payload.checkPoints ?? payload.waypoints ?? [];

    const checkpoints = checkpointsSource
      .map((cp: any, index: number) => {
        if (!cp) {
          return null;
        }

        const latitude = Number(cp.latitude ?? cp.lat);
        const longitude = Number(cp.longitude ?? cp.lng ?? cp.lon);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          return null;
        }

        return {
          id: String(cp.id ?? cp.checkpointId ?? index),
          latitude,
          longitude,
        };
      })
      .filter((cp): cp is Route['checkpoints'][number] => cp !== null);

    return {
      id: String(id),
      name: String(payload.name ?? payload.title ?? 'Route'),
      description: String(payload.description ?? payload.details ?? ''),
      distanceKm: Number(payload.distanceKm ?? payload.distance ?? 0),
      checkpoints,
    };
  }
}
