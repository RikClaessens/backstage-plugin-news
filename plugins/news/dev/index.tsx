import React from 'react';
import { createPlugin, createApiFactory } from '@backstage/core-plugin-api';
import { createDevApp } from '@backstage/dev-utils';
import {
  entityRouteRef,
  catalogApiRef,
  CatalogApi,
} from '@backstage/plugin-catalog-react';
import NewsIcon from '@material-ui/icons/AnnouncementOutlined';
import { newsPlugin, NewsItemsPage } from '../src/plugin';

const mockCatalogApi = {
  getEntityByRef: async (entityRef: string) => {
    if (entityRef === 'group:default/tech-research-labs') {
      return {
        kind: 'Group',
        metadata: {
          name: 'tech-research-labs',
          title: 'Research Labs',
          namespace: 'default',
          description: 'Lab rats',
        },
        spec: {},
      };
    }
    if (entityRef === 'group:default/network-innovation-hub') {
      return {
        kind: 'Group',
        metadata: {
          name: 'network-innovation-hub',
          title: 'Network Innovation Hub',
          namespace: 'default',
          description: 'Hubbies',
        },
        spec: {},
      };
    }
    return undefined;
  },
};

const fakeCatalogPlugin = createPlugin({
  id: 'catalog',
  routes: {
    catalogEntity: entityRouteRef,
  },
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: {},
      factory: () => {
        return mockCatalogApi as CatalogApi;
      },
    }),
  ],
});

createDevApp()
  .registerPlugin(fakeCatalogPlugin)
  .registerPlugin(newsPlugin)
  .addPage({
    element: <NewsItemsPage />,
    title: 'News',
    path: '/news',
    icon: NewsIcon,
  })
  .render();
