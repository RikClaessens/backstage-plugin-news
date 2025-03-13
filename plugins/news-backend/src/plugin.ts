import {
  coreServices,
  createBackendPlugin,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import fetchNews from './services/FetchNewsService';

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
      },
      async init({ logger, config, scheduler, urlReader }) {
        const defaultSchedule = {
          frequency: { minutes: 10 },
          timeout: { minutes: 5 },
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
            });
          },
        });
        logger.info('Initialized backstage-plugin-news');
        logger.info(`News locations: ${locations}`);
      },
    });
  },
});
