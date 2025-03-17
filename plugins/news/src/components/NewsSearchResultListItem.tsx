import { Box, ListItemIcon, ListItemText } from "@material-ui/core";
import React from 'react';
import type { IndexableDocument, ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import { Link } from "@backstage/core-components";
import { AuthorName } from "./PublishedDateAndAuthor";

export type IndexableNewsDocument = IndexableDocument & {
  summary: string;
  createdAt: string;
  author: string;
};

export type NewsSearchResultListItemProps = {
  result?: IndexableNewsDocument;
  icon?: React.ReactNode;
  rank?: number;
  highlight?: ResultHighlight;
};

export const NewsSearchResultListItem = (
  props: NewsSearchResultListItemProps,
): JSX.Element => {
  const { result, highlight, icon } = props;

  if (!result) {
    return <></>;
  }

  return (
    <Box display="flex">
      <ListItemIcon>{icon}</ListItemIcon>
      <Box flexWrap="wrap">
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={
            <Link to={result.location} noTrack>
              {highlight?.fields?.title ? (
                <HighlightedSearchResultText
                  text={highlight.fields.title}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
 result.title
              )}
            </Link>
          }
        />
        <AuthorName author={result.author} />
      </Box>
    </Box>
  );
};

export default NewsSearchResultListItem;