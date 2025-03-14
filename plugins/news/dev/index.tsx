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
    if (entityRef === 'grp-zelda') {
      return {
        kind: 'Group',
        metadata: {
          name: 'grp-zelda',
          title: 'Team Zelda',
          namespace: 'default',
          description: 'Awesome team',
        },
        spec: {},
      };
    }
    if (entityRef === 'nl-group-it-eis-public-cloud-aws') {
      return {
        kind: 'Group',
        metadata: {
          name: 'nl-group-it-eis-public-cloud-aws',
          title: 'Public Cloud AWS',
          namespace: 'default',
          description: 'Awsome team',
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
