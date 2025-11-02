import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Route } from '../models/Route';
import { AUTH_USER_KEY } from '../constants/storageKeys';
import { CheckIn } from '../models/CheckIn';

type ParsedResponse = {
  payload: unknown;
  raw: string | null;
};

type ServiceResult<T> = {
  data: T | null;
  unauthorized: boolean;
};

export default class RouteService {
  private static readonly ROUTES_ENDPOINT = `${BASE_URL}/routes`;

  static async getRoutes(): Promise<ServiceResult<Route[]>> {
    try {
      const requestInit = await RouteService.withAuth();
      const response = await fetch(RouteService.ROUTES_ENDPOINT, requestInit);
      const { payload, raw } = await RouteService.parseResponse(response);

      RouteService.logResponse('GET', RouteService.ROUTES_ENDPOINT, response.status, payload, raw);

      if (RouteService.isUnauthorized(response)) {
        await RouteService.handleUnauthorized();
        return { data: null, unauthorized: true };
      }

      if (!response.ok) {
        console.warn('Failed to fetch routes', payload ?? raw ?? response.statusText);
        return { data: null, unauthorized: false };
      }

      if (!Array.isArray(payload)) {
        console.warn('Unexpected routes payload', payload ?? raw);
        return { data: null, unauthorized: false };
      }

      const routes = payload
        .map(RouteService.mapToRoute)
        .filter((route): route is Route => route !== null);

      return { data: routes, unauthorized: false };
    } catch (error) {
      console.error('Routes fetch error', error);
      return { data: null, unauthorized: false };
    }
  }

  static async getRoute(routeId: string): Promise<ServiceResult<Route>> {
    if (!routeId) {
      return { data: null, unauthorized: false };
    }

    try {
      const requestInit = await RouteService.withAuth();
      const endpoint = `${RouteService.ROUTES_ENDPOINT}/${routeId}`;
      const response = await fetch(endpoint, requestInit);
      const { payload, raw } = await RouteService.parseResponse(response);

      RouteService.logResponse('GET', endpoint, response.status, payload, raw);

      if (RouteService.isUnauthorized(response)) {
        await RouteService.handleUnauthorized();
        return { data: null, unauthorized: true };
      }

      if (response.ok) {
        const route = RouteService.mapToRoute(payload);
        if (route) {
          return { data: route, unauthorized: false };
        }
      } else {
        console.warn('Failed to fetch route', routeId, payload ?? raw ?? response.statusText);
      }
    } catch (error) {
      console.error('Route fetch error', error);
    }

    const routesResult = await RouteService.getRoutes();
    if (routesResult.unauthorized) {
      return { data: null, unauthorized: true };
    }

    const route = routesResult.data?.find((item) => item.id === routeId) ?? null;
    return { data: route, unauthorized: false };
  }

  private static async withAuth(init: RequestInit = {}): Promise<RequestInit> {
    const token = await RouteService.getToken();
    if (!token) {
      return init;
    }

    const headers = new Headers(init.headers as HeadersInit | undefined);
    headers.set('Authorization', `Bearer ${token}`);

    return { ...init, headers };
  }

  private static async getToken(): Promise<string | null> {
    try {
      const stored = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.token === 'string' && parsed.token.length > 0) {
        return parsed.token;
      }
    } catch (error) {
      console.error('Failed to read auth token', error);
    }

    return null;
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
      .filter((cp: Route['checkpoints'][number] | null): cp is Route['checkpoints'][number] => cp !== null);

    return {
      id: String(id),
      name: String(payload.name ?? payload.title ?? 'Route'),
      description: String(payload.description ?? payload.details ?? ''),
      distanceKm: Number(payload.distanceKm ?? payload.distance ?? 0),
      checkpoints,
    };
  }

  static async getCheckIns(routeId: string, username: string): Promise<ServiceResult<CheckIn[]>> {
    try {
      const requestInit = await RouteService.withAuth();
      const endpoint = `${RouteService.ROUTES_ENDPOINT}/${routeId}/checkins?username=${encodeURIComponent(username)}`;
      const response = await fetch(endpoint, requestInit);
      const { payload, raw } = await RouteService.parseResponse(response);

      RouteService.logResponse('GET', endpoint, response.status, payload, raw);

      if (RouteService.isUnauthorized(response)) {
        await RouteService.handleUnauthorized();
        return { data: null, unauthorized: true };
      }

      if (!response.ok || !Array.isArray(payload)) {
        return { data: null, unauthorized: false };
      }

      const checkins = payload
        .map(RouteService.mapToCheckIn)
        .filter((ci: CheckIn | null): ci is CheckIn => ci !== null);

      return { data: checkins, unauthorized: false };
    } catch (error) {
      console.error('Check-ins fetch error', error);
      return { data: null, unauthorized: false };
    }
  }

  static async createCheckIn(routeId: string, checkpointId: string, username: string): Promise<ServiceResult<CheckIn>> {
    try {
      const requestInit = await RouteService.withAuth({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          checkpointId: Number(checkpointId)
        })
      });

      const endpoint = `${RouteService.ROUTES_ENDPOINT}/${routeId}/checkins`;
      const response = await fetch(endpoint, requestInit);
      const { payload, raw } = await RouteService.parseResponse(response);

      RouteService.logResponse('POST', endpoint, response.status, payload, raw);

      if (RouteService.isUnauthorized(response)) {
        await RouteService.handleUnauthorized();
        return { data: null, unauthorized: true };
      }

      if (!response.ok) {
        return { data: null, unauthorized: false };
      }

      const checkIn = RouteService.mapToCheckIn(payload);
      return { data: checkIn, unauthorized: false };
    } catch (error) {
      console.error('Create check-in error', error);
      return { data: null, unauthorized: false };
    }
  }

  private static isUnauthorized(response: Response) {
    return response.status === 401 || response.status === 403;
  }

  private static async handleUnauthorized() {
    try {
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error('Failed to clear auth token', error);
    }
  }

  private static logResponse(method: string, url: string, status: number, payload: unknown, raw: string | null) {
    const tag = `[RouteService] ${method} ${url}`;
    if (payload !== null && payload !== undefined) {
      console.log(tag, 'status:', status, 'payload:', payload);
    } else {
      console.log(tag, 'status:', status, 'raw:', raw);
    }
  }

  private static mapToCheckIn(payload: any): CheckIn | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const id = payload.id ?? payload.checkInId ?? payload.uuid;
    const routeId = payload.routeId ?? payload.route?.id;
    const checkpointId = payload.checkpointId ?? payload.checkpoint?.id ?? null;
    const username = payload.username ?? payload.user?.username ?? payload.user;
    const checkedAt = payload.checkedAt ?? payload.timestamp ?? payload.createdAt;

    if (!id || !routeId || !username || !checkedAt) {
      return null;
    }

    return {
      id: String(id),
      routeId: String(routeId),
      checkpointId: checkpointId != null ? String(checkpointId) : null,
      username: String(username),
      checkedAt: String(checkedAt),
    };
  }
}
