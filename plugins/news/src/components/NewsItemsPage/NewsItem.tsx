import React from 'react';
import { InfoCard, Link } from '@backstage/core-components';
import { useApp } from '@backstage/core-plugin-api';
import { Box, Chip, makeStyles, Typography } from '@material-ui/core';
import MuiArrowForwardIcon from '@material-ui/icons/ArrowForward';
import MuiPeopleIcon from '@material-ui/icons/People';
import { DateTime } from 'luxon';
import { News } from '../../types';
import PublishedDateAndAuthor from '../PublishedDateAndAuthor';

const useStyles = makeStyles(theme => ({
  newsItem: {
    height: '100%',
    '& div:first-of-type': {
      maxWidth: '100%',
    },
  },
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
  summary: {
    flexGrow: 1,
  },
}));

const NewsItem = ({ news }: { news: News }) => {
  const ArrowForwardIcon =
    useApp().getSystemIcon('arrowForward') || MuiArrowForwardIcon;
  const GroupIcon = useApp().getSystemIcon('group') || MuiPeopleIcon;

  const classes = useStyles();

  return (
    <>
      <InfoCard
        title={news.title}
        subheader={<PublishedDateAndAuthor news={news} />}
        subheaderTypographyProps={{
          variant: 'body2',
        }}
        titleTypographyProps={{
          noWrap: true,
        }}
        className={classes.newsItem}
        actions={
          <Link to={`/news/${news.id}`} className={classes.link}>
            <Typography variant="body2" className={classes.linkText}>
              Read more
            </Typography>
            <Box className={classes.linkIcon}>
              <ArrowForwardIcon />
            </Box>
          </Link>
        }
        cardClassName={classes.newsItemCard}
      >
        <Box className={classes.summary}>{news.summary}</Box>
        <p>
          {news.tags.map(tag => (
            <Chip label={tag} size="small" />
          ))}
        </p>
      </InfoCard>
    </>
  );
};

export default NewsItem;
