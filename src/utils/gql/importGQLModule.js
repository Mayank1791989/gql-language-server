/* @flow */
import importFrom from 'import-from';
import semver from 'semver';
import PackageDownloader from './PackageDownloader';
import { getGQLConfig } from './gqlConfig';
import { type ILogger } from './types';

type Options = {|
  gqlPath: string,
  configDir: string,
  autoDownload: boolean,
  logger: ILogger,
|};

export const GQL_MODULE_NAME = '@playlyfe/gql';

export default async function importGQLModule({
  gqlPath,
  configDir,
  autoDownload,
  logger,
}: Options): Promise<{ path: string, module: any }> {
  try {
    // try to load package from cwd
    const mod = importFrom(gqlPath, GQL_MODULE_NAME);
    return {
      module: mod,
      path: gqlPath,
    };
  } catch (err) {
    logger.info(`${GQL_MODULE_NAME} not found in path ${gqlPath}`);
    if (autoDownload) {
      logger.info(
        `(autoDownloadGQL: true) Trying to download ${GQL_MODULE_NAME}...`,
      );

      logger.info(`Getting ${GQL_MODULE_NAME} version from .gqlConfig...`);
      const gqlConfig = getGQLConfig(configDir);
      const { version } = gqlConfig;

      if (!version || !semver.valid(version)) {
        logger.error(
          `No valid version of ${GQL_MODULE_NAME} found in .gqlconfig. ` +
            `Please specify a valid package version in .gqlconfig to auto download package.`,
        );
        throw err;
      }

      logger.info(`${GQL_MODULE_NAME} version ${version} found in .gqlconfig.`);
      const pkgPath = await new PackageDownloader({ logger }).getPackage({
        name: GQL_MODULE_NAME,
        version,
      });

      const mod = importFrom(pkgPath, GQL_MODULE_NAME);

      return {
        module: mod,
        path: pkgPath,
      };
    }

    logger.info(
      `Skipping auto download ${GQL_MODULE_NAME} (autoDownloadGQL: false).`,
    );

    throw err;
  }
}
