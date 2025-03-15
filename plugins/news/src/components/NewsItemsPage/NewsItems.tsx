import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import {
  useApi,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { Box, makeStyles } from '@material-ui/core';
import { News } from '../../types';
import NewsItem from './NewsItem';

const useStyles = makeStyles(theme => ({
  newsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
    gap: 16,
    alignItems: 'stretch',
    maxWidth: '100%',
  },
  newsItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));

const NewsList = ({ newsItems }: { newsItems: News[] }) => {
  const classes = useStyles();
  console.log(newsItems);
  return (
    <Box className={classes.newsList}>
      {newsItems.map(news => (
        <Box key={news.id} className={classes.newsItemContainer}>
          <NewsItem news={news} />
        </Box>
      ))}
    </Box>
  );
};

const NewsItems = () => {
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);

  const apiUrl = `${config.getConfig('backend').getString('baseUrl')}/api/news/`;
  const {
    value: newsItems,
    loading,
    error,
  } = useAsync(async (): Promise<News[]> => {
    const { token } = await identityApi.getCredentials();

    const headers: HeadersInit = new Headers();
    if (token && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const result = await fetch(apiUrl, {
      headers,
    });
    return result.json();
  }, [apiUrl]);

  if (loading) {
    return <Progress />;
  } else if (error || (newsItems as any).error) {
    return (
      <ResponseErrorPanel
        error={error || new Error((newsItems as any).error)}
      />
    );
  }

  console.log(newsItems);

  return <NewsList newsItems={newsItems || []} />;
};

export default NewsItems;
