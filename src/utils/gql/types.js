/* @flow strict */
/* eslint-disable playlyfe/flow-object-type-delimiter */
export interface IGQLConfig {
  getFileExtensions(): Array<string>;
  getDir(): string;
}
export type GQLConfigFile = {
  version: string,
};
export type EmitterSubscription = { +remove: () => void };

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
export type GQLSchema = $FixMe;

export type IGQLServiceCommandParams = {
  sourcePath: string,
  sourceText: string,
  position: GQLPosition,
};

export type LogListener = ({
  +level: 'info' | 'error' | 'debug',
  +name: string,
  +args: Array<mixed>,
}) => void;

export interface IGQLService {
  start(): Promise<void>;
  stop(): Promise<void>;

  onChange(listener: () => void): EmitterSubscription;
  onError(listener: (err: Error) => void): EmitterSubscription;
  onLog(listener: LogListener): EmitterSubscription;

  getSchema(): GQLSchema;
  getConfig(): IGQLConfig;
  status(): Array<GQLError>;
  autocomplete(params: IGQLServiceCommandParams): Array<GQLHint>;
  getDef(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLLocation>;
  findRefs(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLLocation>;
  getInfo(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLInfo>;
}

export interface ILogger {
  info(msg: string, ...args: Array<mixed>): void;
  error(msg: string, ...args: Array<mixed>): void;
  warn(msg: string, ...args: Array<mixed>): void;
  debug(msg: string, ...args: Array<mixed>): void;
}

declare export class GQLV2Service {
  +_config: IGQLConfig;
  +_schemaBuilder: { getSchema: () => GQLSchema };

  constructor(options: {
    onInit: () => void,
    onChange: () => void,
  }): this;

  status(): Array<GQLError>;
  autocomplete(params: IGQLServiceCommandParams): Array<GQLHint>;
  getDef(params: IGQLServiceCommandParams): GQLLocation;
  findRefs(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLLocation>;
  getInfo(params: IGQLServiceCommandParams): GQLInfo;
}

declare export class GQLV3Service implements IGQLService {
  constructor(options: $FixMe): this;

  start(): Promise<void>;
  stop(): Promise<void>;

  onChange(listener: () => void): EmitterSubscription;
  onError(listener: (err: Error) => void): EmitterSubscription;
  onLog(listener: LogListener): EmitterSubscription;

  getSchema(): GQLSchema;
  getConfig(): IGQLConfig;
  status(): Array<GQLError>;
  autocomplete(params: IGQLServiceCommandParams): Array<GQLHint>;
  getDef(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLLocation>;
  findRefs(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLLocation>;
  getInfo(params: IGQLServiceCommandParams): $ReadOnlyArray<GQLInfo>;
}

declare export class GQLV2Module {
  +version: string;
  +GQLService: Class<GQLV2Service>;
}

declare export class GQLV3Module {
  +version: string;
  +GQLService: Class<GQLV3Service>;
}

export type GQLModule = GQLV2Module | GQLV3Module;
