/* @flow */
import { getLogger } from 'log4js';
import { loadGQLService, type IGQLService } from './utils/gql';

import UniversalDisposable from './utils/UniversalDisposable';
import TextDocuments from './utils/TextDocuments';

import Completion from './providers/Completion';
import Definition from './providers/Definition';
import References from './providers/References';
import Diagnostics from './providers/Diagnostics';
import Hover from './providers/Hover';

import {
  type IConnection,
  BulkRegistration,
  DidOpenTextDocumentNotification,
  DidChangeTextDocumentNotification,
  DidCloseTextDocumentNotification,
  CompletionRequest,
  HoverRequest,
  DefinitionRequest,
  ReferencesRequest,
} from './utils/lsp';
import {
  CodeLensRequest,
  ExecuteCommandRequest,
  ShowMessageRequest,
} from 'vscode-languageserver-protocol';
import { uriToFilePath } from './utils/helpers';

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
  const disposable = new UniversalDisposable();
  const documents = new TextDocuments();

  logger.debug('creating server with options', options);

  disposable.add(documents);

  connection.onShutdown(() => {
    logger.info('server connection shutting down');
    disposable.dispose();
  });

  connection.onInitialize(async params => {
    logger.debug('onInitiialized called');

    const gqlService = await loadGQLService({
      configDir: options.configDir || params.rootPath || process.cwd(),
      gqlPath: options.gqlPath || params.rootPath || process.cwd(),
      watchman: options.watchman,
      autoDownloadGQL: options.autoDownloadGQL,
      debug: options.loglevel === 'debug',
    });
    const onErrorSubscription = gqlService.onError(err => logger.error(err));
    const onLogSubscription = gqlService.onLog(({ level, name, args }) => {
      gqlLogger.category = name;
      gqlLogger[level](...args);
    });

    // cleanup gqlService
    disposable.add(() => {
      gqlService.stop();
      onErrorSubscription.remove();
      onLogSubscription.remove();
    });

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
        });
      });
      return {
        capabilities: {},
        fileExtensions: gqlService.getConfig().getFileExtensions(),
      };
    }

    // if dynamic registrations not supported
    logger.debug('Client does not supports dynamic registrations.');
    return {
      capabilities: {
        textDocumentSync: documents.syncKind,
        definitionProvider: true,
        hoverProvider: true,
        executeCommandProvider: {
          commands: ['goToResolver', 'goToSchema'],
        },
        codeLensProvider: {
          resolveProvider: true,
        },
        referencesProvider: true,
        completionProvider: {
          resolveProvider: false,
          triggerCharacters: ['.'],
        },
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
  // Code Lens
  connection.onCodeLens(({ textDocument: { uri } }) => {
    return gqlService.getLenses({
      sourcePath: uriToFilePath(uri),
    });
  });

  // Code Lens Resolve
  connection.onCodeLensResolve(
    ({ range, data: { typeName, fieldName, path, type } }) => {
      return {
        range,
        command: {
          title: type === 'schema' ? 'Go To Resolver' : 'Go To Schema',
          command: type === 'schema' ? 'goToResolver' : 'goToSchema',
          arguments: [typeName, fieldName, path],
        },
      };
    },
  );

  // Execute Command
  connection.onExecuteCommand(async ({ command, arguments: args }) => {
    const [fieldType, fieldName] = args;
    if (command === 'goToResolver') {
      const resolverLocation = await gqlService.getResolverLocation({
        fieldType,
        fieldName,
      });
      console.log(JSON.stringify(resolverLocation));
      connection.sendRequest(ShowMessageRequest.type.method, {
        type: 2,
        message: `${fieldType} - ${fieldName} - ${resolverLocation.path}`,
      });
      /*
      connection.workspace
        .applyEdit({
          documentChanges: [
            {
              kind: 'create',
              uri: `file://${resolverLocation.path}`,
              options: {
                ignoreIfExists: false,
              },
            },
          ],
        })
        .then((res, err) => {
          console.log(JSON.stringify(res));
          console.log(err);
        });
      */
    } else if (command === 'goToSchema') {
      const schemaLocation = await gqlService.getSchemaLocation({
        fieldType,
        fieldName,
      });
      console.log(JSON.stringify(schemaLocation));
      connection.sendRequest(ShowMessageRequest.type.method, {
        type: 2,
        message: `${fieldType} - ${fieldName} - ${schemaLocation.path}`,
      });
    }
    return null;
  });

  // diagnostics
  const diagnostics = new Diagnostics({ gqlService });
  diagnostics.listen(diagnosticItems => {
    diagnosticItems.forEach(connection.sendDiagnostics);
  });

  // completion
  const completion = new Completion({ documents, gqlService });
  connection.onCompletion(docParams => {
    logger.debug(
      `completion requested for document ${docParams.textDocument.uri}`,
    );
    return completion.provideCompletionItems(docParams);
  });

  // definition
  const definition = new Definition({ documents, gqlService });
  connection.onDefinition(docParams => {
    logger.debug(
      `definition requested for document ${docParams.textDocument.uri}`,
    );
    return definition.provideDefinition(docParams);
  });

  // find refs
  const references = new References({ documents, gqlService });
  connection.onReferences(docParams => {
    logger.debug(
      `references requested for document ${docParams.textDocument.uri}`,
    );
    return references.provideReferences(docParams);
  });

  // hover
  const hover = new Hover({ documents, gqlService });
  connection.onHover(docParams => {
    logger.debug(`hover requested for document ${docParams.textDocument.uri}`);
    return hover.provideHover(docParams);
  });
}

function registerCapabilitiesDynamically(params: {
  gqlService: IGQLService,
  connection: IConnection,
  syncKind: any,
}) {
  const extensions = params.gqlService.getConfig().getFileExtensions();
  const documentOptions = {
    documentSelector: [
      { scheme: 'file', pattern: `**/*.{${extensions.join(',')},ts,js}` },
    ],
  };
  const documentOptionsGql = {
    documentSelector: [
      { scheme: 'file', pattern: `**/*.{${extensions.join(',')}}` },
    ],
  };

  logger.info('Dynamically registering capabilities for ', documentOptions);

  const registration = BulkRegistration.create();

  registration.add(DidOpenTextDocumentNotification.type, documentOptions);
  registration.add(DidChangeTextDocumentNotification.type, {
    documentSelector: documentOptions.documentSelector,
    syncKind: params.syncKind,
  });
  registration.add(DidCloseTextDocumentNotification.type, documentOptions);

  registration.add(CompletionRequest.type, documentOptionsGql);
  registration.add(HoverRequest.type, documentOptionsGql);
  registration.add(DefinitionRequest.type, documentOptions);
  registration.add(ReferencesRequest.type, documentOptionsGql);

  registration.add(CodeLensRequest.type, {
    ...documentOptions,
    resolveProvider: true,
  });

  registration.add(ExecuteCommandRequest.type, {
    commands: ['goToResolver', 'goToSchema'],
  });

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
