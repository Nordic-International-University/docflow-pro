// ABOUT/routes/ABOUT.routes.ts
import { lazy } from 'react';

const ABOUTComponent = lazy(() => import('../components/ABOUT.component'));

export const ABOUTRoutes = [
  {
    path: '/-a-b-o-u-t',
    component: ABOUTComponent,
    name: 'ABOUT',
    meta: {
      title: 'ABOUT',
      requiresAuth: false,
      // Qoshimcha meta ma'lumotlar
    }
  },
  {
    path: '/-a-b-o-u-t/:id',
    component: ABOUTComponent,
    name: 'ABOUTDetail',
    meta: {
      title: 'ABOUT Detail',
      requiresAuth: false,
    }
  },
  // Qoshimcha routelar
];
