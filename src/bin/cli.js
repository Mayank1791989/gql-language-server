#!/usr/bin/env node
/* @flow */
import yargs from 'yargs';

import initializeLogging, { LOG_LEVEL } from '../utils/logging';
import createConnection, {
  type ConnectionOptions,
  CONNECTION_METHOD,
} from '../createConnection';
import createServer, { type ServerOptions } from '../createServer';
import path from 'path';

const cli = yargs
  .usage('gql-language-server Command-Line Interface.\n Usage: $0 [args]')
  .help('h')
  .alias('h', 'help')
  .option('node-ipc', {
    describe:
      'Use node-ipc to communicate with the server. Useful for calling from a node.js client.\n',
    type: 'string',
  })
  .option('stdio', {
    describe: 'Use stdio to communicate with the server\n',
    type: 'string',
  })
  .option('socket', {
    describe:
      'Use a socket (with a port number like --socket=5051) to communicate with the server.\n',
    type: 'number',
  })
  .option('gql-path', {
    describe: 'An absolute path to a gql. [default: process.cwd()]\n',
    type: 'string',
    coerce: (value) => {
      if (!path.isAbsolute(value)) {
        throw new Error(`'gql-path' value '${value}' is not an absolute path.`);
      }
      // console.log(args);
      return value;
    },
  })
  .option('config-dir', {
    describe:
      'An absolute path to config dir. [default: process.cwd()] ' +
      'Walks up the directory tree from the provided config directory, until a .gqlconfig file is found or the root directory is reached.\n',
    type: 'string',
    coerce: (value) => {
      if (!path.isAbsolute(value)) {
        throw new Error(
          `'config-dir' value '${value}' is not an absolute path.`,
        );
      }
      return value;
    },
  })
  .option('auto-download-gql', {
    describe: 'Automatically download gql package if not found.\n',
    type: 'boolean',
    default: true,
  })
  .option('watchman', {
    describe: 'use watchman to watch files (if available).\n',
    type: 'boolean',
    default: true,
  })
  .option('loglevel', {
    describe: 'log level.\n',
    choices: Object.values(LOG_LEVEL),
    default: LOG_LEVEL.info,
  })
  .check((argv) => {
    if (
      Object.values(CONNECTION_METHOD).filter((m) => argv[m] != null).length !==
      1
    ) {
      throw new Error(
        'gql-language-server requires exactly one valid connection option (node-ipc, stdio, or socket).',
      );
    }
    return true;
  });

const connection = createConnection(getConnectionOptions(cli.argv));

// init logging
initializeLogging(connection, cli.argv.loglevel);

// create server
const server = createServer(connection, getServerOptions(cli.argv));

// start server
server.listen();

function getConnectionOptions(argv): ConnectionOptions {
  const method = Object.values(CONNECTION_METHOD).find((m) => argv[m] != null);
  switch (method) {
    case CONNECTION_METHOD.socket:
      return { method: 'socket', port: (argv.socket: number) };
    case CONNECTION_METHOD.stdio:
      return { method: 'stdio' };
    case CONNECTION_METHOD.nodeIpc:
      return { method: 'node-ipc' };
    default:
      return invariant(false, 'Invalid connection method');
  }
}

function getServerOptions(argv): ServerOptions {
  const autoDownloadGQL = argv['auto-download-gql'];
  // eslint-disable-next-line prefer-destructuring, dot-notation
  const watchman = argv['watchman'];
  const configDir = argv['config-dir'];
  const gqlPath = argv['gql-path'];
  // eslint-disable-next-line prefer-destructuring, dot-notation
  const loglevel = argv['loglevel'];

  return {
    autoDownloadGQL,
    watchman,
    configDir,
    gqlPath,
    loglevel,
  };
}

function invariant(condition, ...msgs) {
  if (!condition) {
    /* eslint-disable no-console */
    console.error('ERROR:', ...msgs);
    console.error();
    /* eslint-enable */
    cli.showHelp();
    process.exit(1);
  }
}
