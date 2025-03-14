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
  },
  linkText: {
    margin: theme.spacing(0, 1),
  },
  linkIcon: {
    marginLeft: '0.5rem',
    display: 'flex',
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

export const AuthorName = ({ news }: { news: News }) => {
  const catalogApi = useApi(catalogApiRef);
  const { value } = useAsync(
    async () => catalogApi.getEntityByRef(news.author),
    [news],
  );

  return value?.metadata.title ?? news.author;
};

const PublishedDateAndAuthor = ({ news }: { news: News }) => {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center">
      Published {getRelativePublishedDate(news)} by
      <Box>
        <Link to={news.author} className={classes.link}>
          <Box className={classes.linkIcon}>
            <GroupIcon />
          </Box>
          <Typography variant="body2" className={classes.linkText}>
            <AuthorName news={news} />
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default PublishedDateAndAuthor;
