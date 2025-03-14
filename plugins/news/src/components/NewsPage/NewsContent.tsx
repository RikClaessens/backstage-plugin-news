import React from 'react';
import { MarkdownContent } from '@backstage/core-components';
import { Box, Card, CardContent, useTheme } from '@material-ui/core';
import { News } from '../../types';

const NewsContent = ({ news }: { news: News }) => {
  const theme = useTheme();
  return (
    <Box maxWidth={theme.breakpoints.values.md} margin="auto">
      <Card>
        <CardContent>
          <MarkdownContent content={news.body} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewsContent;
