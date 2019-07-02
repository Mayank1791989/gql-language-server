/* @flow strict */
import {
  type IGQLService,
  type GQLModule,
  GQLV2Module,
  GQLV3Module,
} from './types';
import GQLV2ToV3Service from './GQLV2ToV3Service';
import semver from 'semver';

declare function isV2Module(
  gqlModule: GQLModule,
): boolean %checks(gqlModule instanceof GQLV2Module);
// eslint-disable-next-line no-redeclare
export function isV2Module(gqlModule: GQLModule) {
  return semver.satisfies(gqlModule.version, '2.x');
}

declare function isV3Module(
  gqlModule: GQLModule,
): boolean %checks(gqlModule instanceof GQLV3Module);
// eslint-disable-next-line no-redeclare
export function isV3Module(gqlModule: GQLModule) {
  return semver.satisfies(gqlModule.version, '3.x');
}

export function createGQLServiceFromV3Module(
  gqlModule: GQLV3Module,
  options: {|
    configDir: string,
    watchman: boolean,
  |},
): IGQLService {
  const gqlService = new gqlModule.GQLService(options);
  return gqlService;
}

export function createGQLServiceFromV2Module(
  gqlModule: GQLV2Module,
  options: {|
    cwd: string,
    debug: boolean,
  |},
): IGQLService {
  const GQLV2Sservice = gqlModule.GQLService;
  const gqlService = new GQLV2ToV3Service(GQLV2Sservice, options);
  return gqlService;
}
