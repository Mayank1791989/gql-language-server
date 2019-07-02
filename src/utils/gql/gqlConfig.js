/* @flow strict */
import findConfig from 'find-config';
import fs from 'fs-extra';
import JSON5 from 'json5';
import path from 'path';
import { type GQLConfigFile } from './types';

const CONFIG_FILE_NAME = '.gqlconfig';

export function getGQLConfig(cwd: string): GQLConfigFile {
  const configInfo = findConfigFile(cwd);
  const configFile = readConfigFile(configInfo.path);
  return configFile;
}

export function findConfigFile(cwd: string): { path: string, dir: string } {
  const result = findConfig.obj(CONFIG_FILE_NAME, { cwd });
  if (!result) {
    // throw error .gqlConfig not found
    throw new Error(`Could not find a '${CONFIG_FILE_NAME}' file.`);
  }
  return result;
}

findConfigFile.silent = (cwd: string) => {
  try {
    return findConfigFile(cwd);
  } catch (err) {
    return null;
  }
};

function readConfigFile(filePath: string): GQLConfigFile {
  const fileData = fs.readFileSync(filePath, 'utf8');
  try {
    const configFile = JSON5.parse(fileData);
    return configFile;
  } catch (err) {
    const filename = path.basename(filePath);
    throw new Error(
      `GQL_CONFIG_FILE_INVALID: Error parsing '${filename}' \n\n${err.message}`,
    );
  }
}
