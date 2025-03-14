/* eslint-disable @backstage/no-undeclared-imports */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { newsItemRouteRef } from '../routes';
import NewsItemsPage, { NewsItemsPageProps } from './NewsItemsPage';
import NewsPage from './NewsPage';

type RouterProps = {
  themeId?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  hideContextMenu?: boolean;
  cardOptions?: {
    titleLength: number | undefined;
  };
  buttonOptions?: {
    name: string | undefined;
  };
  hideInactive?: boolean;
};

export const Router = (props: RouterProps) => {
  const propsWithDefaults: NewsItemsPageProps = {
    title: 'News',
    subtitle: "Check out what's new!",
    themeId: 'app',
    ...props,
  };

  return (
    <Routes>
      <Route path="/" element={<NewsItemsPage {...propsWithDefaults} />} />
      <Route
        path={newsItemRouteRef.path}
        element={<NewsPage {...propsWithDefaults} />}
      />
    </Routes>
  );
};
