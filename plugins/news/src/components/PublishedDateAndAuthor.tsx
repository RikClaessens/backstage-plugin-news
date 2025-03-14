/* eslint-disable @backstage/no-undeclared-imports */
import React from 'react';
import { Link } from 'react-router-dom';
import { GroupIcon } from '@backstage/core-components';
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
            {news.author}
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default PublishedDateAndAuthor;
