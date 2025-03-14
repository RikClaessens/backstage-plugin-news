import React from 'react';
/* eslint-disable @backstage/no-undeclared-imports */
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  Breadcrumbs,
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Link,
  MarkdownContent,
  Page,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { Typography } from '@material-ui/core';
import { News } from '../../types';
import PublishedDateAndAuthor, {
  getRelativePublishedDate,
} from '../PublishedDateAndAuthor';
import NewsContent from './NewsContent';

export interface NewsPageProps {
  title?: string;
  subtitle?: string;
  themeId?: string;
}

const NewsPage = ({
  title = 'News',
  subtitle = "Check out what's new!",
  themeId = 'service',
}: NewsPageProps) => {
  const params = useParams();
  const { id } = params;
  const config = useApi(configApiRef);

  const apiUrl = `${config.getConfig('backend').getString('baseUrl')}/api/news`;

  const {
    value: news,
    loading,
    error,
  } = useAsync(async (): Promise<News> => {
    const result = await fetch(`${apiUrl}/${id}`);
    return result.json();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error || !news) {
    return <ResponseErrorPanel error={error || new Error('News not found')} />;
  }

  return (
    <Page themeId={themeId}>
      <Header title={news.title || title} type="News">
        <HeaderLabel label="Published" value={getRelativePublishedDate(news)} />
        <HeaderLabel label="Published by" value={news.author} />
      </Header>

      <Content>
        <NewsContent news={news} />
      </Content>
    </Page>
  );
};

export default NewsPage;
