import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import NewsItems from './NewsItems';

export interface NewsItemsPageProps {
  title?: string;
  subtitle?: string;
  themeId: string;
}

const NewsItemsPage = ({ title, subtitle, themeId }: NewsItemsPageProps) => {
  return (
    <Page themeId={themeId}>
      <Header title={title} subtitle={subtitle} />
      <Content>
        <NewsItems />
      </Content>
    </Page>
  );
};

export default NewsItemsPage;
