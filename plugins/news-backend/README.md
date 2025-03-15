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

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn dev` from the root directory.
