// src/viewmodels/RoutesViewModel.ts

import { Route } from "../models/Route";

export const useRoutesViewModel = () => {
  // 模拟数据
  const routes: Route[] = [
    {
      id: "r1",
      name: "City Explorer",
      description: "Explore the downtown area and check in at key spots.",
      distanceKm: 3.5,
      checkpoints: [
        { id: "c1", latitude: -36.8485, longitude: 174.7633 },
        { id: "c2", latitude: -36.8500, longitude: 174.7650 },
      ],
    },
    {
      id: "r2",
      name: "Harbour Run",
      description: "Run along the beautiful Auckland Harbour.",
      distanceKm: 5.2,
      checkpoints: [
        { id: "c3", latitude: -36.8467, longitude: 174.7700 },
        { id: "c4", latitude: -36.8450, longitude: 174.7750 },
      ],
    },
  ];

  return { routes };
};