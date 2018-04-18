/* @flow */
import { type GQLModule } from './types';
import importGQLModule, { GQL_MODULE_NAME } from './importGQLModule';
import {
  isV2Module,
  isV3Module,
  createGQLServiceFromV2Module,
  createGQLServiceFromV3Module,
} from './gqlModule';
import { type IGQLService } from './types';
import { getLogger } from 'log4js';

const logger = getLogger('load-gql-service');

type Options = {
  configDir: string,
  gqlPath: string,
  autoDownloadGQL: boolean,
  watchman: boolean,
  debug: boolean,
};

export default async function loadGQLService(
  options: Options,
): Promise<IGQLService> {
  logger.info(`loading ${GQL_MODULE_NAME}...`);

  const moduleInfo = await importGQLModule({
    gqlPath: options.gqlPath,
    configDir: options.configDir,
    autoDownload: options.autoDownloadGQL,
    logger,
  });

  logger.info(`using ${GQL_MODULE_NAME} from path ${moduleInfo.path}`);

  const gqlModule: GQLModule = moduleInfo.module;

  if (isV2Module(gqlModule)) {
    if (options.watchman === false) {
      logger.warn(
        `${GQL_MODULE_NAME} v2.x doesnt support disabling watchman.` +
          ' Upgrade to v3 if you dont want to use watchman.',
      );
    }

    return createGQLServiceFromV2Module(gqlModule, {
      cwd: options.configDir,
      debug: options.debug,
    });
  }

  if (isV3Module(gqlModule)) {
    return createGQLServiceFromV3Module(gqlModule, {
      configDir: options.configDir,
      watchman: options.watchman,
    });
  }

  logger.error(
    `${GQL_MODULE_NAME} v${
      gqlModule.version
    } is not supported. Currently we support v2.x and v3.x.`,
  );

  return Promise.reject(new Error('Failed to load gql-service'));
}

export type { IGQLService };
