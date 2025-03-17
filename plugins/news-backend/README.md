# @rikclaessens/backstage-plugin-news-backend

The News plugin retrieves markdown files with frontmatter and displays them as news articles in Backstage, Spotify's IDP framework. This is the backend plugin that retrieves news items, stores them in the database and make them available through the api.

## Installation

To install this plugin to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @rikclaessens/backstage-plugin-news-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@rikclaessens/backstage-plugin-news-backend'));
```

To configure the locations of the news articles, add the following to your app's `app-config.yaml`:

```yaml
news:
  locations:
    - https://dev.azure.com/your-org/your-project/_git/your-news-repo
```

## Writing content

You can add `.md` files to the configured locations. The files should have a frontmatter section at the top of the file. The frontmatter should contain the following fields:
- `title`: The title of the news item
- `summary`: A short summary of the news item
- `created_at`: The date the news item was created in the format `YYYY-MM-DD`
- `author`: The author of the news item, backstage ref
- `status`: The status of the news item, one of `draft`, `published`
- `tags`: An array of tags for the news item

An example of a news item markdown file:

```md
---
title: Backstage is the best way to create an IDP
summary: Using Spotify's Backstage framework to create an IDP for your company is the best way to go. You leverage a wide community of developers and a robust framework to build your IDP.
created_at: 2025-03-13
author: my-awesome-team
status: published
tags: [artificial-intelligence, software-development]
---


# Title

more markdown content here
```

For now, relative urls for images are not supported. Use absolute urls instead.

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.
