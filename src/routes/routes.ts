// src/routes/routes.ts
import { ABOUTRoutes } from '../features/ABOUT/routes/ABOUT.routes';
import { usersRoutes } from '../features/users/routes/users.routes';

export const routes = [
  ...usersRoutes,
  ...ABOUTRoutes,
  // Boshqa routelar
];
