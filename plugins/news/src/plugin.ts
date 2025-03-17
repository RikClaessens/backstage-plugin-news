import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react';

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

export const NewsSearchResultListItem = newsPlugin.provide(
  createSearchResultListItemExtension({
    name: 'NewsSearchResultListItem',
    predicate: result => result.type === 'news',
    component: () =>
      import('./components/NewsSearchResultListItem').then(
        m => m.NewsSearchResultListItem,
      ),
  }),
);