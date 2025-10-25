// src/models/Route.ts

export type Checkpoint = {
  id: string;
  latitude: number;
  longitude: number;
};

export type Route = {
  id: string;
  name: string;
  description: string;
  distanceKm: number;
  checkpoints: Checkpoint[];
};