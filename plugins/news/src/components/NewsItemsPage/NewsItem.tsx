import React from 'react';
import { InfoCard, Link } from '@backstage/core-components';
import { Box, Chip, makeStyles } from '@material-ui/core';
import { News } from '../../types';
import PublishedDateAndAuthor from '../PublishedDateAndAuthor';

const useStyles = makeStyles(theme => ({
  newsItem: {
    height: '100%',
    '& div:first-of-type': {
      maxWidth: '100%',
    },
    textDecoration: 'none !important',
  },
  newsItemInfoCard: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  newsItemCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  summary: {
    flexGrow: 1,
  },
}));

const NewsItem = ({ news }: { news: News }) => {
  const classes = useStyles();

  return (
    <Link to={`/news/${news.id}`} className={classes.newsItem}>
      <InfoCard
        title={news.title}
        subheader={<PublishedDateAndAuthor news={news} />}
        subheaderTypographyProps={{
          variant: 'body2',
        }}
        titleTypographyProps={{
          noWrap: true,
        }}
        className={classes.newsItemInfoCard}
        cardClassName={classes.newsItemCard}
      >
        <Box className={classes.summary}>{news.summary}</Box>
        <p>
          {news.tags.map(tag => (
            <Chip label={tag} size="small" />
          ))}
        </p>
      </InfoCard>
    </Link>
  );
};

export default NewsItem;
