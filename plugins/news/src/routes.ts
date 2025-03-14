import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'news',
});

export const newsItemRouteRef = createSubRouteRef({
  id: 'news/id',
  path: '/:id',
  parent: rootRouteRef,
});
