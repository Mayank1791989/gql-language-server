/* @flow strict */
import { type IConnection } from 'vscode-languageserver';

function configure(config: { connection: IConnection }, layouts: $FixMe) {
  const { connection } = config;

  // eslint-disable-next-line playlyfe/flow-no-weak-types
  return (loggingEvent: $FixMe): void => {
    connection.console.log(layouts.basicLayout(loggingEvent));
  };
}

export { configure };
