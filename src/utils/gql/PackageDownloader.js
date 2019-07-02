/* @flow strict */
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import os from 'os';
import { ILogger } from './types';

const YARN_CLI_PATH = require.resolve('yarn/bin/yarn.js');

type PkgOptions = {|
  name: string,
  version: string,
|};

type Options = {
  logger: ILogger,
};

export default class PackageDownloader {
  dir = '';
  logger: ILogger;

  constructor({ logger }: Options) {
    this.logger = logger;
    this.dir = this._getDownloadsDirPath();
  }

  async getPackage({ version, name }: PkgOptions): Promise<string> {
    if (!(await this._verifyPackage({ version, name }))) {
      await this._downloadPackage({ version, name });
    }
    return this._genPathForPackage({ version, name });
  }

  async clean() {
    await fs.emptyDir();
  }

  async _downloadPackage({ version, name }: PkgOptions) {
    const pkgPath = this._genPathForPackage({ version, name });
    const pkgName = `${name}@${version}`;

    // make sure directory is empty
    await fs.emptyDir(pkgPath);

    this.logger.info(`[yarn] downloading ${pkgName} in ${pkgPath}...`);

    execSync(`node ${YARN_CLI_PATH} add ${pkgName}`, {
      cwd: pkgPath,
      encoding: 'utf8',
    });
    this.logger.info(`[yarn] ${pkgName} downloaded.`);
  }

  async _verifyPackage({ name, version }: PkgOptions) {
    const pkgPath = this._genPathForPackage({ version, name });
    // check package present
    const found = await this._isPackagePresent({ name, version });
    if (!found) {
      return false;
    }

    // check install package not modified
    try {
      execSync(`node ${YARN_CLI_PATH} check`, {
        cwd: pkgPath,
        encoding: 'utf8',
        stdio: 'ignore',
      });
    } catch (err) {
      this.logger.info(
        `${name} at path ${pkgPath} failed to pass integrity check`,
      );
      return false;
    }

    return true;
  }

  async _isPackagePresent({ name, version }: PkgOptions): Promise<boolean> {
    const pkgPath = this._genPathForPackage({ version, name });
    try {
      return await fs.pathExists(
        path.join(pkgPath, 'node_modules', '.yarn-integrity'),
      );
    } catch (err) {
      return false;
    }
  }

  _genPathForPackage({ name, version }: PkgOptions) {
    return path.join(this.dir, `${name}-${version}`);
  }

  _getDownloadsDirPath() {
    const fallback = path.join(os.homedir(), '.local', 'share');

    let localDataDir = '';
    switch (process.platform) {
      case 'darwin':
        localDataDir = path.join(os.homedir(), 'Library');
        break;
      case 'win32':
        localDataDir = process.env.APPDATA || fallback;
        break;
      default:
        localDataDir = process.env.XDG_DATA_HOME || fallback;
        break;
    }

    return path.join(localDataDir, 'package-downloader');
  }
}
