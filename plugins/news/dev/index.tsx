import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import NewsIcon from '@material-ui/icons/AnnouncementOutlined';
import { newsPlugin, NewsItemsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(newsPlugin)
  .addPage({
    element: <NewsItemsPage />,
    title: 'News',
    path: '/news',
    icon: NewsIcon,
  })
  .render();
