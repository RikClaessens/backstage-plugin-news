/* eslint-disable @backstage/no-undeclared-imports */
import React from 'react';
import { Link } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { GroupIcon } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { News } from '../types';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.link,
  },
  linkText: {
    margin: 1,
  },
  linkIcon: {
    display: 'flex',
    marginRight: theme.spacing(1),
    fontSize: 'inherit',
  },
  newsItemCard: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const getRelativePublishedDate = (news: News) =>
  DateTime.fromISO(news.created_at).toRelative();

export const RelativePublishedDate = ({ news }: { news: News }) =>
  getRelativePublishedDate(news);

export const AuthorName = ({ author }: { author: string }) => {
  const catalogApi = useApi(catalogApiRef);
  const { value } = useAsync(
    async () => catalogApi.getEntityByRef(`group:default/${author}`),
    [author],
  );

  return <>{value?.metadata.title ?? author}</>;
};

const PublishedDateAndAuthor = ({
  news,
  vertical = false,
}: {
  news: News;
  vertical?: boolean;
}) => {
  const classes = useStyles();
  return (
    <Typography variant="body2">
      <Box display="flex" flexDirection={vertical ? 'column' : 'row'}>
        <Typography variant="body2" style={{ marginRight: 8 }}>
          Published {getRelativePublishedDate(news)} by
        </Typography>
        <Link to={news.author} className={classes.link}>
          <Box className={classes.linkIcon}>
            <GroupIcon />
          </Box>
          <Typography variant="body2" className={classes.linkText}>
            <AuthorName author={news.author} />
          </Typography>
        </Link>
      </Box>
    </Typography>
  );
};

export default PublishedDateAndAuthor;
