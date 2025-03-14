import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const newsPlugin = createPlugin({
  id: 'news',
  routes: {
    root: rootRouteRef,
  },
});

export const NewsItemsPage = newsPlugin.provide(
  createRoutableExtension({
    name: 'NewsItemsPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
