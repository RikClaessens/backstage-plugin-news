import {
  coreServices,
  createBackendPlugin,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { createRouter } from './router';
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
        httpRouter: coreServices.httpRouter,
        scheduler: coreServices.scheduler,
        urlReader: coreServices.urlReader,
        database: coreServices.database,
        discovery: coreServices.discovery,
      },
      async init({
        config,
        logger,
        httpRouter,
        scheduler,
        urlReader,
        database,
        discovery,
      }) {
        const persistenceContext = await initializePersistenceContext(database);
        logger.info(`Base url: ${await discovery.getBaseUrl('news')}`);

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

        if (locations && locations.length > 0) {
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
          logger.info(
            `News retrieval scheduled task started, locations: ${locations}`,
          );
        } else {
          logger.info(
            'No news retrieval scheduled task started, no locations configured',
          );
        }
        logger.info('Initialized backstage-plugin-news');

        httpRouter.use(
          await createRouter({
            persistenceContext,
          }),
        );
      },
    });
  },
});
