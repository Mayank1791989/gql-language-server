/* @flow */
import { IConnection } from 'vscode-languageserver';

function configure(config: { connection: IConnection }, layouts) {
  const { connection } = config;

  // eslint-disable-next-line playlyfe/flow-no-weak-types
  return (loggingEvent: any): void => {
    connection.console.log(layouts.basicLayout(loggingEvent));
  };
}

export { configure };
