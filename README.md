# Backstage plugin news

This is the repo for the News plugin for Backstage. The News plugin retrieves markdown files with frontmatter and displays them as news articles in Backstage, Spotify's IDP framework.

The repo contains the following packages:

- `news`: This is the frontend plugin that offers a number of frontend components to renders news items.
- `news-backend`: This is the backend plugin that retrieves news items, stores them in the database and make them available through the api.
- `search-backend-module-news`: This is the search backend module that retrieves news items stored in the database and indexes them in the configured search service.

## Early stages

This plugin is in the early stages of development. It is not yet ready for production use. It has limited functionality and focuses on a happy path scenario.

## Goal

The News plugin should provide a way to display news items in Backstage. These news items can be written by different teams and stored in various git repositories. The plugin will be able to retrieve them from any in you Backstage instance properly configure integrations, e.g. from Azure DevOps repositories. 

## Quick start

### Backend & Search

```bash
# From your root directory
yarn --cwd packages/backend add @rikclaessens/backstage-plugin-news-backend
yarn --cwd packages/backend add @rikclaessens/backstage-plugin-search-backend-module-news
```

Then add the backend and search plugins to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@rikclaessens/backstage-plugin-news-backend'));
backend.add(import('@rikclaessens/backstage-plugin-search-backend-module-news'));
```

### Add some content

Write some content with the following format and store it in a git repository:

```md
---
title: Backstage is the best way to create an IDP
summary: Using Spotify's Backstage framework to create an IDP for your company is the best way to go. You leverage a wide community of developers and a robust framework to build your IDP.
created_at: 2025-03-13
author: my-awesome-team
status: published
tags: [artificial-intelligence, software-development]
---

For now, relative urls for images are not supported. Use absolute urls instead.

# Title

more markdown content here
```

### Configure location of the content in your app-config

To configure the locations of the news articles, add the following to your app's `app-config.yaml`:

```yaml
news:
  locations:
    - https://dev.azure.com/your-org/your-project/_git/your-news-repo
```

### Install the frontend plugin

To install the plugin in the Backstage app, run the following commands:

```bash
yarn --cwd packages/app add @rikclaessens/backstage-plugin-news
```

Then, make the plugin available in your Backstage instance by adding it to the `App.tsx`:

```tsx
...
import { NewsItemsPage } from '@rikclaessens/backstage-plugin-news';
...

const routes = (
  <FlatRoutes>
    ...
    <Route path="/news" element={<NewsItemsPage />} />
    ...
  </FlatRoutes>
);
...
```

### Install the Search Result List Item extension

When searching for news, Backstage provides a default search result item. The plugin provides a result item that shows more information to the user. To use this result item, add the following code to the `SearchPage.tsx`:

```tsx
import { NewsSearchResultListItem } from '@rikclaessens/backstage-plugin-news';
...

<SearchResult>
  ...
  <NewsSearchResultListItem icon={<Bullhorn />} />
</SearchResult>
...
```