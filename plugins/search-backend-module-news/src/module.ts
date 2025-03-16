import {
  coreServices,
  createBackendModule,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { NewsCollatorFactory } from './collators/NewsCollatorFactory';

export const searchModuleNews = createBackendModule({
  pluginId: 'search',
  moduleId: 'news',
  register(reg) {
    reg.registerInit({
      deps: { logger: coreServices.logger,
        config: coreServices.rootConfig,
        indexRegistry: searchIndexRegistryExtensionPoint,
        scheduler: coreServices.scheduler,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
       },
      async init({ logger, config, indexRegistry, scheduler, auth, discovery }) {
       
        const defaultSchedule = {
          frequency: { minutes: 1 },
          timeout: { seconds: 20 },
          initialDelay: { seconds: 15 },
        };

        logger.info('Registering news collator');

        const schedule = config.has('search.collators.news.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('search.collators.announcements.schedule'),
            )
          : defaultSchedule;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: NewsCollatorFactory.fromConfig({
            discoveryApi: discovery,
            logger,
            auth,
          }),
        });
      }
    });
  },
});
