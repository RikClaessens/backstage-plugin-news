import {
  coreServices,
  createBackendPlugin,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import fetchNews from './services/NewsService';
import { initializePersistenceContext } from './services/NewsService/persistence/persistenceContext';

/**
 * newsPlugin backend plugin
 *
 * @public
 */
export const newsPlugin = createBackendPlugin({
  pluginId: 'news',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
        scheduler: coreServices.scheduler,
        urlReader: coreServices.urlReader,
        database: coreServices.database,
      },
      async init({ logger, config, scheduler, urlReader, database }) {
        const persistenceContext = await initializePersistenceContext(database);

        const defaultSchedule = {
          frequency: { seconds: 20 },
          timeout: { seconds: 5 },
          initialDelay: { seconds: 3 },
        };

        const schedule = config.has('news.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('news.schedule'),
            )
          : defaultSchedule;

        const locations = config.getStringArray('news.locations');
        const integrations = ScmIntegrations.fromConfig(config);

        await scheduler.scheduleTask({
          ...schedule,
          id: 'retrieve-news-documents',
          fn: async () => {
            await fetchNews({
              logger,
              locations,
              urlReader,
              integrations,
              persistenceContext,
            });
          },
        });
        logger.info('Initialized backstage-plugin-news');
        logger.info(`News locations: ${locations}`);
      },
    });
  },
});
