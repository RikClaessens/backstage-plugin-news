import { LoggerService, UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import { kebabCase } from 'change-case';
import fs from 'fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import uuid from 'uuid-by-string';
import { parseNews } from './parseNews';
import { PersistenceContext } from './persistence/persistenceContext';

interface FetchNewsProps {
  logger: LoggerService;
  locations: string[];
  urlReader: UrlReaderService;
  integrations: ScmIntegrations;
  persistenceContext: PersistenceContext;
}

const processNewsLocations = async (
  dir: string,
  locations: string[],
  urlReader: UrlReaderService,
  logger: LoggerService,
  integrations: ScmIntegrations,
  existingNewsItems: Set<string>,
  persistenceContext: PersistenceContext,
) => {
  await Promise.all(
    locations.map(async (location, index) => {
      const locationDir = resolvePath(dir, `location-${index}`);
      fs.mkdirSync(locationDir);
      logger.info(`Created location dir: ${locationDir}`);
      await fetchContents({
        reader: urlReader,
        integrations,
        baseUrl: location,
        outputPath: locationDir,
      });
      await processAllNews(
        locationDir,
        location,
        logger,
        existingNewsItems,
        persistenceContext,
      );
    }),
  );
};

const processAllNews = async (
  dir: string,
  location: string,
  logger: LoggerService,
  existingNewsItems: Set<string>,
  persistenceContext: PersistenceContext,
  idPart = '',
) => {
  logger.info(`Processing location: ${location}`);
  // recursively go through all files in the directory
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = resolvePath(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await processAllNews(
        filePath,
        location,
        logger,
        existingNewsItems,
        persistenceContext,
        `${idPart}-${file}`,
      );
    }
    logger.info(`Processing file: ${filePath}`);
    if (filePath.endsWith('.md')) {
      try {
        logger.info(`Processing file: ${filePath}`);
        const doc = parseNews(filePath);

        const id = uuid(kebabCase(`${idPart}-${file}`));
        console.log(`id: ${id}`);
        existingNewsItems.delete(id);

        await persistenceContext.newsDb.upsertNews({ ...doc, id });
      } catch (error) {
        logger.error(`Error processing file: ${filePath}`);
        logger.error(`${error}`);
      }
    }
  }
};

const deleteNonExistingNews = async (
  newsIdsToDelete: Set<string>,
  persistenceContext: PersistenceContext,
) => {
  newsIdsToDelete.forEach(async id => {
    await persistenceContext.newsDb.deleteAnnouncementByID(id);
  });
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

  logger.info(`Processing news locations: ${locations}`);
  await processNewsLocations(
    tempDir,
    locations,
    urlReader,
    logger,
    integrations,
    existingNewsItems,
    persistenceContext,
  );

  logger.info(`Deleting non-existing news ${Array.from(existingNewsItems)}`);
  await deleteNonExistingNews(existingNewsItems, persistenceContext);

  fs.rmSync(tempDir, { recursive: true });
  logger.info(`Deleted temp dir: ${tempDir}`);
};

export default fetchNews;
