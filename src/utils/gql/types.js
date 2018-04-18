/* @flow */
/* eslint-disable playlyfe/flow-object-type-delimiter */
export interface IGQLConfig {
  getFileExtensions(): Array<string>;
}
export type GQLConfigFile = {
  version: string,
};

type AbsoluteFilePath = string;
type Line = number; // (start from 1)
type Column = number; // (start from 1)

export type GQLPosition = {
  line: Line,
  column: Column,
};
export type GQLLocation = {
  start: GQLPosition,
  end: GQLPosition,
  path: AbsoluteFilePath,
};

export type GQLErrorSeverityType = 'error' | 'warn';

export type GQLErrorLocation = {
  // NOTE: graphql all line, column startsWith 1 (not zero)
  line: number,
  column: number,
  path: AbsoluteFilePath,
};

export type GQLError = {
  message: string,
  severity: GQLErrorSeverityType,
  locations: ?Array<GQLErrorLocation>,
};
export type GQLHint = {
  text: string,
  type?: string,
  description?: ?string,
};
export type GQLInfo = {
  contents: Array<string>,
};
export type GQLSchema = any;

export type IGQLServiceCommandParams = {
  sourcePath: string,
  sourceText: string,
  position: GQLPosition,
};

export interface IGQLService {
  start(): Promise<void>;
  stop(): Promise<void>;

  onChange(listener: () => void): { remove: () => void };
  onError(listener: (err: Error) => void): { remove: () => void };
  onLog(listener: Function): { remove: () => void };

  getSchema(): GQLSchema;
  getConfig(): IGQLConfig;
  status(): Array<GQLError>;
  autocomplete(params: IGQLServiceCommandParams): Array<GQLHint>;
  getDef(params: IGQLServiceCommandParams): ?GQLLocation;
  findRefs(params: IGQLServiceCommandParams): Array<GQLLocation>;
  getInfo(params: IGQLServiceCommandParams): ?GQLInfo;
}

export type GQLModule = {
  version: string,
  GQLService: any,
};

export interface ILogger {
  info(...args: any): any;
  error(...args: any): any;
  warn(...args: any): any;
  debug(...args: any): any;
}
