import React from 'react';
import { MarkdownContent } from '@backstage/core-components';
import { Box, Card, CardContent, useTheme } from '@material-ui/core';
import { News } from '../../types';
import PublishedDateAndAuthor from '../PublishedDateAndAuthor';

const NewsContent = ({ news }: { news: News }) => {
  const theme = useTheme();
  return (
    <Box maxWidth={theme.breakpoints.values.md} margin="auto">
      <Box mb={2}>
        <PublishedDateAndAuthor news={news} />
      </Box>
      <Card>
        <CardContent>
          <MarkdownContent content={news.body} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewsContent;
