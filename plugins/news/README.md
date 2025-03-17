# backstage-plugin-news

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