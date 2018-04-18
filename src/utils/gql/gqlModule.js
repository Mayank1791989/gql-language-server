/* @flow */
import { type IGQLService, type GQLModule } from './types';
import GQLV2ToV3Service from './GQLV2ToV3Service';
import semver from 'semver';

export function isV2Module(gqlModule: GQLModule) {
  return semver.satisfies(gqlModule.version, '2.x');
}

export function isV3Module(gqlModule: GQLModule) {
  return semver.satisfies(gqlModule.version, '3.x');
}

export function createGQLServiceFromV3Module(
  gqlModule: GQLModule,
  options: {|
    configDir: string,
    watchman: boolean,
  |},
): IGQLService {
  const gqlService = new gqlModule.GQLService(options);
  return gqlService;
}

export function createGQLServiceFromV2Module(
  gqlModule: GQLModule,
  options: {|
    cwd: string,
    debug: boolean,
  |},
): IGQLService {
  const GQLV2Sservice = gqlModule.GQLService;
  const gqlService = new GQLV2ToV3Service(GQLV2Sservice, options);
  return gqlService;
}
