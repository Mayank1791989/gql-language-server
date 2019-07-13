/* @flow strict */
import { getLogger } from 'log4js';
import { loadGQLService, type IGQLService } from './utils/gql';
import { CompositeDisposable, Disposable } from './utils/Disposable';

import Completion from './providers/Completion';
import Definition from './providers/Definition';
import References from './providers/References';
import Diagnostics from './providers/Diagnostics';
import Hover from './providers/Hover';

import {
  type IConnection,
  type TextDocumentSyncKindType,
  type InitializeResult,
  BulkRegistration,
  DidOpenTextDocumentNotification,
  DidChangeTextDocumentNotification,
  DidCloseTextDocumentNotification,
  CompletionRequest,
  HoverRequest,
  DefinitionRequest,
  ReferencesRequest,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver';

const logger = getLogger('gql-language-server');
const gqlLogger = getLogger(); // logger name will be set while logging

export type ServerOptions = {|
  autoDownloadGQL: boolean,
  watchman: boolean,
  loglevel: string,
  configDir: ?string,
  gqlPath: ?string,
|};

export default function createServer(
  connection: IConnection,
  options: ServerOptions,
) {
  logger.info(`running in node ${process.version} (${process.execPath})`);

  const disposable = new CompositeDisposable();
  const documents = new TextDocuments(TextDocumentSyncKind.Incremental);

  logger.debug('creating server with options', options);

  connection.onShutdown(() => {
    logger.info('server connection shutting down');
    disposable.dispose();
  });

  connection.onInitialize(async (params): Promise<InitializeResult> => {
    logger.debug('onInitiialized called');

    const gqlService = await loadGQLService({
      configDir: options.configDir || params.rootPath || process.cwd(),
      gqlPath: options.gqlPath || params.rootPath || process.cwd(),
      watchman: options.watchman,
      autoDownloadGQL: options.autoDownloadGQL,
      debug: options.loglevel === 'debug',
    });
    const onErrorSubscription = gqlService.onError((err) => logger.error(err));
    const onLogSubscription = gqlService.onLog(({ level, name, args }) => {
      gqlLogger.category = name;
      gqlLogger[level](...args);
    });

    // cleanup gqlService
    disposable.add(
      new Disposable(() => {
        gqlService.stop();
        onErrorSubscription.remove();
        onLogSubscription.remove();
      }),
    );

    try {
      logger.info('starting gql service...');
      await gqlService.start();
      logger.info('gql service started');
    } catch (err) {
      if (logger.isDebugEnabled()) {
        logger.error(err);
      }
      throw err;
    }

    // setup providers
    setupProviders(connection, gqlService, documents);

    logger.info('gql-language-server started');
    // check client
    if (checkClientSupportsDynamicRegistrations(params.capabilities)) {
      logger.debug(
        'Client supports dynamic registrations. Capabilities will be registered dynamically',
      );
      connection.onInitialized(() => {
        registerCapabilitiesDynamically({
          gqlService,
          connection,
          syncKind: documents.syncKind,
          clientSupportsRelativePattern:
            typeof params.initializationOptions === 'object' &&
            params.initializationOptions !== null
              ? params.initializationOptions.relativePattern === true
              : false,
        });
      });
      return {
        capabilities: {},
        fileExtensions: gqlService.getConfig().getFileExtensions(),
      };
    }

    // if dynamic registrations not supported
    logger.debug('Client does not support dynamic registrations.');
    return {
      capabilities: {
        textDocumentSync: documents.syncKind,
        definitionProvider: true,
        hoverProvider: true,
        referencesProvider: true,
        completionProvider: Object.freeze({
          resolveProvider: false,
          triggerCharacters: ['.'],
        }),
      },
      fileExtensions: gqlService.getConfig().getFileExtensions(),
    };
  });

  return {
    listen() {
      documents.listen(connection);
      connection.listen();
    },
  };
}

function setupProviders(connection, gqlService, documents) {
  // diagnostics
  const diagnostics = new Diagnostics({ gqlService });
  diagnostics.listen((diagnosticItems) => {
    diagnosticItems.forEach(connection.sendDiagnostics);
  });

  // completion
  const completion = new Completion({ documents, gqlService });
  connection.onCompletion((docParams) => {
    logger.debug(
      `completion requested for document ${docParams.textDocument.uri}`,
    );
    return completion.provideCompletionItems(docParams);
  });

  // definition
  const definition = new Definition({ documents, gqlService });
  connection.onDefinition((docParams) => {
    logger.debug(
      `definition requested for document ${docParams.textDocument.uri}`,
    );
    return definition.provideDefinition(docParams);
  });

  // find refs
  const references = new References({ documents, gqlService });
  connection.onReferences((docParams) => {
    logger.debug(
      `references requested for document ${docParams.textDocument.uri}`,
    );
    return references.provideReferences(docParams);
  });

  // hover
  const hover = new Hover({ documents, gqlService });
  connection.onHover((docParams) => {
    logger.debug(`hover requested for document ${docParams.textDocument.uri}`);
    return hover.provideHover(docParams);
  });
}

function registerCapabilitiesDynamically(params: {
  gqlService: IGQLService,
  connection: IConnection,
  syncKind: TextDocumentSyncKindType,
  clientSupportsRelativePattern: boolean,
}) {
  const gqlConfig = params.gqlService.getConfig();
  const extensions = gqlConfig.getFileExtensions();
  const pattern = `**/*.{${extensions.join(',')}}`;
  const documentOptions = {
    documentSelector: [
      {
        scheme: 'file',
        // NOTE: relative pattern is not mentioned in lsp spec
        // but vscode supports it so enabling under a flag
        pattern: params.clientSupportsRelativePattern
          ? { base: gqlConfig.getDir(), pattern }
          : pattern,
      },
    ],
  };

  logger.info(
    'Dynamically registering capabilities for documents matching',
    JSON.stringify(documentOptions.documentSelector, null, 2),
  );

  const registration = BulkRegistration.create();

  registration.add(DidOpenTextDocumentNotification.type, documentOptions);
  registration.add(DidChangeTextDocumentNotification.type, {
    documentSelector: documentOptions.documentSelector,
    syncKind: params.syncKind,
  });
  registration.add(DidCloseTextDocumentNotification.type, documentOptions);

  registration.add(CompletionRequest.type, documentOptions);
  registration.add(HoverRequest.type, documentOptions);
  registration.add(DefinitionRequest.type, documentOptions);
  registration.add(ReferencesRequest.type, documentOptions);

  params.connection.client.register(registration);
}

function checkClientSupportsDynamicRegistrations(capabilities) {
  // FIXME: Improve this
  // checking dynamicRegistration for only one capability and assuming others
  // also supports dynamicRegistrations
  return (
    capabilities &&
    capabilities.textDocument &&
    capabilities.textDocument.completion &&
    capabilities.textDocument.completion.dynamicRegistration
  );
}
