# @rikclaessens/backstage-plugin-search-backend-module-news

The News plugin retrieves markdown files with frontmatter and displays them as news articles in Backstage, Spotify's IDP framework. This is the search backend module that retrieves news items stored in the database and indexes them in the configured search service.

## Installation

To install this plugin to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @rikclaessens/backstage-plugin-search-backend-module-news
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@rikclaessens/backstage-plugin-search-backend-module-news'));
```

