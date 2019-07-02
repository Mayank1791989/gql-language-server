/* @flow */
import log4js from 'log4js';
import path from 'path';
import { type IConnection } from 'vscode-languageserver';

export const LOG_LEVEL = Object.freeze({
  debug: 'debug',
  info: 'info',
  error: 'error',
  off: 'off',
});

type LogLevel = $Values<typeof LOG_LEVEL>;
// Configure log4js to not log to console, since
// writing arbitrary data to stdout will break JSON RPC if we're running over
// stdout.
//
// Additionally, add an appender to log over the rpc connection so logging appears
// in the client environment, independent of stdio, node rpc, socket, etc.
export default function initializeLogging(
  connection: IConnection,
  level: LogLevel,
) {
  log4js.configure({
    appenders: {
      // connection logger
      _connection: {
        connection,
        type: path.join(__dirname, 'appender-connection.js'),
      },
      connection: {
        type: 'logLevelFilter',
        level,
        appender: '_connection',
      },
    },
    categories: {
      default: {
        appenders: ['connection'],
        level,
      },
    },
  });

  const logger = log4js.getLogger('gql-language-server');

  process.on('uncaughtException', (e) => logger.error('uncaughtException', e));
  process.on('unhandledRejection', (e) =>
    logger.error('unhandledRejection', e),
  );

  // don't let anything write to the true stdio as it could break JSON RPC
  global.console.log = connection.console.log.bind(connection.console);
  global.console.error = connection.console.error.bind(connection.console);
}
