import { LoggerService, UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import fs from 'fs';
import os from 'os';
import { resolve as resolvePath } from 'path';

interface FetchNewsProps {
  logger: LoggerService;
  locations: string[];
  urlReader: UrlReaderService;
  integrations: ScmIntegrations;
}

const fetchNews = async ({
  logger,
  locations,
  urlReader,
  integrations,
}: FetchNewsProps) => {
  logger.info(`Fetching news`);

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

  fs.rmdirSync(tempDir, { recursive: true });
  logger.info(`Deleted temp dir: ${tempDir}`);
};

export default fetchNews;
