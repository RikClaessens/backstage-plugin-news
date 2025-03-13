import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { NewsDatabase } from './NewsDatabase';

export type PersistenceContext = {
  newsDb: NewsDatabase;
};

const migrationsDir = resolvePackagePath(
  '@rikclaessens/plugin-news-backend',
  'db/migrations',
);

export const initializePersistenceContext = async (
  database: DatabaseService,
): Promise<PersistenceContext> => {
  const client = await database.getClient();

  if (!database.migrations?.skip) {
    await client.migrate.latest({
      directory: migrationsDir,
    });
  }

  return {
    newsDb: new NewsDatabase(client),
  };
};
