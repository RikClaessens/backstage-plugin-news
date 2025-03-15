import React from 'react';
import { InfoCard, Link } from '@backstage/core-components';
import { useApp } from '@backstage/core-plugin-api';
import { Box, Button, Chip, makeStyles, Typography } from '@material-ui/core';
import MuiArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { News } from '../../types';
import PublishedDateAndAuthor from '../PublishedDateAndAuthor';

const useStyles = makeStyles(theme => ({
  newsItem: {
    height: '100%',
    '& div:first-of-type': {
      maxWidth: '100%',
    },
    '& > div': {
      height: '100%',
    },
    textDecoration: 'none !important',
    border: `1px solid ${theme.palette.border}`,
    borderRadius: theme.shape.borderRadius,
  },
  newsItemInfoCard: {
    // '&:hover': {
    //   backgroundColor: `${theme.palette.action.hover} !important`,
    //   '& div': {
    //     backgroundColor: `${theme.palette.action.hover} !important`,
    //   },
    // },
  },
  newsItemCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  summary: {
    flexGrow: 1,
  },
  button: {
    display: 'flex',
    textTransform: 'none',
  },
  linkText: {},
  linkIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const NewsItem = ({ news }: { news: News }) => {
  const classes = useStyles();

  const ArrowForwardIcon =
    useApp().getSystemIcon('arrowForward') || MuiArrowForwardIcon;

  return (
    <Link to={`/news/${news.id}`} className={classes.newsItem}>
      <InfoCard
        title={news.title}
        subheader={<PublishedDateAndAuthor news={news} vertical />}
        subheaderTypographyProps={{
          variant: 'body2',
        }}
        titleTypographyProps={{
          noWrap: true,
        }}
        className={classes.newsItemInfoCard}
        cardClassName={classes.newsItemCard}
        actions={
          <Button
            href={`/news/${news.id}`}
            className={classes.button}
            endIcon={<ArrowForwardIcon />}
            color="primary"
          >
            Read more
          </Button>
        }
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
