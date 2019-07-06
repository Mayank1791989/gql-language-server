/* @flow strict */
import {
  type IConnection,
  createConnection as lspCreateConnection,
} from 'vscode-languageserver';
import { IPCMessageReader, IPCMessageWriter } from 'vscode-jsonrpc';

import net from 'net';
import stream from 'stream';

export const CONNECTION_METHOD = Object.freeze({
  socket: 'socket',
  stdio: 'stdio',
  nodeIpc: 'node-ipc',
});

export type ConnectionOptions =
  | {| +method: 'socket', +port: number |}
  | {| +method: 'stdio' |}
  | {| +method: 'node-ipc' |};

export default function createConnection(
  options: ConnectionOptions,
): IConnection {
  switch (options.method) {
    case 'socket': {
      // For socket connection, the message connection needs to be
      // established before the server socket starts listening.
      // Do that, and return at the end of this block.
      const writer = new stream.PassThrough();
      const reader = new stream.PassThrough();
      const server = net
        .createServer((socket) => {
          server.close();
          socket.pipe(writer);
          reader.pipe(socket);
        })
        .listen(options.port);

      return lspCreateConnection((reader: $FixMe), (writer: $FixMe));
    }
    case 'stdio': {
      const reader = process.stdin;
      const writer = process.stdout;
      return lspCreateConnection((reader: $FixMe), (writer: $FixMe));
    }
    case 'node-ipc':
    default: {
      const reader = new IPCMessageReader(process);
      const writer = new IPCMessageWriter(process);
      return lspCreateConnection(reader, writer);
    }
  }
}
