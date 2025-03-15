import React from 'react';
/* eslint-disable @backstage/no-undeclared-imports */
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  Content,
  Header,
  HeaderLabel,
  Page,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  useApi,
  configApiRef,
  useApp,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { Box, Button, useMediaQuery, useTheme } from '@material-ui/core';
import MuiArrowBackIcon from '@material-ui/icons/ArrowBack';
import { News } from '../../types';
import { AuthorName, RelativePublishedDate } from '../PublishedDateAndAuthor';
import NewsContent from './NewsContent';

export interface NewsPageProps {
  title?: string;
  subtitle?: string;
  themeId: string;
}

const NewsPage = ({ title, themeId = 'service' }: NewsPageProps) => {
  const ArrowBackIcon = useApp().getSystemIcon('arrowBack') || MuiArrowBackIcon;

  const params = useParams();
  const { id } = params;
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);

  const apiUrl = `${config.getConfig('backend').getString('baseUrl')}/api/news`;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const {
    value: news,
    loading,
    error,
  } = useAsync(async (): Promise<News> => {
    const { token } = await identityApi.getCredentials();
    const headers: HeadersInit = new Headers();
    if (token && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const result = await fetch(`${apiUrl}/${id}`, {
      headers,
    });
    return result.json();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error || !news) {
    return <ResponseErrorPanel error={error || new Error('News not found')} />;
  }

  return (
    <Page themeId={themeId}>
      <Header title={news.title || title} />
      <Content>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            href="/news"
            style={{ textTransform: 'none', marginBottom: '1rem' }}
          >
            Back to news
          </Button>
          <NewsContent news={news} />
        </Box>
      </Content>
    </Page>
  );
};

export default NewsPage;
