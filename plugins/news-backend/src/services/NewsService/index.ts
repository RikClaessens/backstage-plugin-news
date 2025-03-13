import { LoggerService, UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import { kebabCase } from 'change-case';
import fs from 'fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { parseNews } from './parseNews';
import { PersistenceContext } from './persistence/persistenceContext';

interface FetchNewsProps {
  logger: LoggerService;
  locations: string[];
  urlReader: UrlReaderService;
  integrations: ScmIntegrations;
  persistenceContext: PersistenceContext;
}

const getId = (location: string, filePath: string) => {
  return `${kebabCase(location.replace('https://', ''))}-${filePath}`;
};

const fetchNews = async ({
  logger,
  locations,
  urlReader,
  integrations,
  persistenceContext,
}: FetchNewsProps) => {
  logger.info(`Fetching news`);

  const existingNewsItems = new Set(
    (await persistenceContext.newsDb.allNewsIds()).map(news => news.id),
  );

  const tempDir = fs.mkdtempSync(
    resolvePath(os.tmpdir(), 'backstage-plugin-news-'),
  );
  logger.info(`Created temp dir: ${tempDir}`);

  await Promise.all(
    locations.map(async (location, index) => {
      const locationDir = resolvePath(tempDir, `location-${index}`);
      fs.mkdirSync(locationDir);
      logger.info(`Created location dir: ${locationDir}`);
      await fetchContents({
        reader: urlReader,
        integrations,
        baseUrl: location,
        outputPath: locationDir,
      });
    }),
  );

  const id = getId(locations[0], 'zelda/Zelda Release v1.3.0.md');
  existingNewsItems.delete(id);
  const doc = parseNews(
    resolvePath(tempDir, 'location-0', 'zelda', 'Zelda Release v1.3.0.md'),
  );

  await persistenceContext.newsDb.upsertNews({ ...doc, id });

  existingNewsItems.forEach(async id => {
    await persistenceContext.newsDb.deleteAnnouncementByID(id);
  });

  fs.rmSync(tempDir, { recursive: true });
  logger.info(`Deleted temp dir: ${tempDir}`);
};

export default fetchNews;
