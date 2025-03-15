# backstage-plugin-news

To install the plugin in the Backstage app, run the following commands:

```bash
yarn --cwd packages/app add @rikclaessens/backstage-plugin-news
```

To configure the locations of the news articles, add the following to your app's `app-config.yaml`:

```yaml
news:
  locations:
    - https://dev.azure.com/your-org/your-project/_git/your-news-repo
```

Finally, make the plugin available in your Backstage instance by adding it to the `App.tsx`:

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
