declare module 'vscode-languageserver' {
  import type {
    TextDocumentSyncKindType,
    TextDocumentPositionParams,
    InitializeParams,
    InitializeResult,
    InitializeError,
    CodeActionParams,
    CodeLensParams,
    DocumentFormattingParams,
    DocumentRangeFormattingParams,
    DocumentOnTypeFormattingParams,
    RenameParams,
    DocumentLinkParams,
    ExecuteCommandParams,
    ReferenceParams,
    PublishDiagnosticsParams,
    DidChangeConfigurationParams,
    DidChangeWatchedFilesParams,
    DidOpenTextDocumentParams,
    DidChangeTextDocumentParams,
    DidCloseTextDocumentParams,
    WillSaveTextDocumentParams,
    DidSaveTextDocumentParams,
    ClientCapabilities,
    ServerCapabilities,
    MessageTypeValue as RPCMessageType,
  } from 'vscode-languageserver-protocol';

  import type {
    TextDocumentChangeEvent,
    TextDocumentWillSaveEvent,
    ITextEdit,
    ICommand,
    IHover,
    ICompletionItem,
    ICompletionList,
    IDefinition,
    ICodeLens,
    ISymbolInformation,
    ISignatureHelp,
    IDocumentHighlight,
    ILocation,
  } from 'vscode-languageserver-types';

  import type {
    RequestHandler,
    RequestHandler0,
    NotificationHandler,
    NotificationHandler0,
    NotificationType,
    NotificationType0,
    RequestType,
    RequestType0,
    GenericNotificationHandler,
    StarNotificationHandler,
    GenericRequestHandler,
    StarRequestHandler,
    IConnectionStrategy,
    IDisposable,
  } from 'vscode-jsonrpc';

  declare type Thenable<T> = Promise<T>;

  declare var uriToFilePath: typeof undefined;

  declare var resolveGlobalNodePath: typeof undefined;

  declare var resolveGlobalYarnPath: typeof undefined;

  declare var resolve: typeof undefined;

  declare var resolveModule: typeof undefined;

  declare var resolveModule2: typeof undefined;

  declare var resolveModulePath: typeof undefined;
  /**
   * An empty interface for new proposed API.
   */
  declare export interface _ {}

  /**
   * Helps tracking error message. Equal occurences of the same
   * message are only stored once. This class is for example
   * usefull if text documents are validated in a loop and equal
   * error message should be folded into one.
   */
  declare export class ErrorMessageTracker {
    constructor(): this;

    /**
     * Add a message to the tracker.
     * @param message The message to add.
     */
    add(message: string): void;

    /**
     * Send all tracked messages to the conenction's window.
     * @param connection The connection establised between client and server.
     */
    sendErrors(connection: {
      window: RemoteWindow,
    }): void;
  }

  declare export interface Remote {
    /**
     * Attach the remote to the given connection.
     * @param connection The connection this remote is operating on.
     */
    attach(connection: IConnection): void;

    /**
     * The connection this remote is attached to.
     */
    connection: IConnection;

    /**
     * Called to initialize the remote with the given
     * client capabilities
     * @param capabilities The client capabilities
     */
    initialize(capabilities: ClientCapabilities): void;

    /**
     * Called to fill in the server capabilities this feature implements.
     * @param capabilities The server capabilities to fill.
     */
    fillServerCapabilities(capabilities: ServerCapabilities): void;
  }

  /**
   * The RemoteConsole interface contains all functions to interact with
   * the developer console of VS Code.
   */
  declare export type RemoteConsole = {
    /**
     * Show an error message.
     * @param message The message to show.
     */
    error(message: string): void,

    /**
     * Show a warning message.
     * @param message The message to show.
     */
    warn(message: string): void,

    /**
     * Show an information message.
     * @param message The message to show.
     */
    info(message: string): void,

    /**
     * Log a message.
     * @param message The message to log.
     */
    log(message: string): void,
  } & Remote;

  /**
   * The RemoteWindow interface contains all functions to interact with
   * the visual window of VS Code.
   */
  declare export type RemoteWindow = {
    /**
     * Show an error message.
     * @param message The message to show.
     */
    showErrorMessage(message: string): void,
    showErrorMessage<T>(message: string, ...actions: T[]): Thenable<T>,

    /**
     * Show a warning message.
     * @param message The message to show.
     */
    showWarningMessage(message: string): void,
    showWarningMessage<T>(message: string, ...actions: T[]): Thenable<T>,

    /**
     * Show an information message.
     * @param message The message to show.
     */
    showInformationMessage(message: string): void,
    showInformationMessage<T>(message: string, ...actions: T[]): Thenable<T>,
  } & Remote;

  /**
   * A bulk registration manages n single registration to be able to register
   * for n notifications or requests using one register request.
   */
  declare export interface IBulkRegistration {
    /**
     * Adds a single registration.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     */
    add<RO>(type: NotificationType0<RO>, registerParams: RO): void;
    add<P, RO>(type: NotificationType<P, RO>, registerParams: RO): void;

    /**
     * Adds a single registration.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     */
    add<R, E, RO>(type: RequestType0<R, E, RO>, registerParams: RO): void;
    add<P, R, E, RO>(type: RequestType<P, R, E, RO>, registerParams: RO): void;
  }

  declare export var BulkRegistration: {
    /**
     * Creates a new bulk registration.
     * @return  an empty bulk registration.
     */
    create(): IBulkRegistration,
  };

  declare export interface IBulkUnregistration extends IDisposable {
    /**
     * Disposes a single registration. It will be removed from the
     * `BulkUnregistration`.
     */
    disposeSingle(arg: string | RPCMessageType): boolean;
  }

  declare export var BulkUnregistration: {
    /**
     * Creates a new bulk registration.
     * @return  an empty bulk registration.
     */
    create(): IBulkRegistration,
  };

  /**
   * Interface to register and unregister `listeners` on the client / tools side.
   */
  declare export interface IRemoteClient extends Remote {
    /**
     * Registers a listener for the given notification.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     * @return  a `Disposable` to unregister the listener again.
     */
    register<RO>(
      type: NotificationType0<RO>,
      registerParams?: RO,
    ): Thenable<IDisposable>;
    register<P, RO>(
      type: NotificationType<P, RO>,
      registerParams?: RO,
    ): Thenable<IDisposable>;

    /**
     * Registers a listener for the given notification.
     * @param unregisteration the unregistration to add a corresponding unregister action to.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     * @return  the updated unregistration.
     */
    register<RO>(
      unregisteration: IBulkUnregistration,
      type: NotificationType0<RO>,
      registerParams?: RO,
    ): Thenable<IBulkUnregistration>;
    register<P, RO>(
      unregisteration: IBulkUnregistration,
      type: NotificationType<P, RO>,
      registerParams?: RO,
    ): Thenable<IBulkUnregistration>;

    /**
     * Registers a listener for the given request.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     * @return  a `Disposable` to unregister the listener again.
     */
    register<R, E, RO>(
      type: RequestType0<R, E, RO>,
      registerParams?: RO,
    ): Thenable<IDisposable>;
    register<P, R, E, RO>(
      type: RequestType<P, R, E, RO>,
      registerParams?: RO,
    ): Thenable<IDisposable>;

    /**
     * Registers a listener for the given request.
     * @param unregisteration the unregistration to add a corresponding unregister action to.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     * @return  the updated unregistration.
     */
    register<R, E, RO>(
      unregisteration: IBulkUnregistration,
      type: RequestType0<R, E, RO>,
      registerParams?: RO,
    ): Thenable<IBulkUnregistration>;
    register<P, R, E, RO>(
      unregisteration: IBulkUnregistration,
      type: RequestType<P, R, E, RO>,
      registerParams?: RO,
    ): Thenable<IBulkUnregistration>;

    /**
     * Registers a set of listeners.
     * @param registrations the bulk registration
     * @return  a `Disposable` to unregister the listeners again.
     */
    register(registrations: IBulkRegistration): Thenable<IBulkUnregistration>;
  }

  /**
   * Represents the workspace managed by the client.
   */
  declare export interface IRemoteWorkspace extends Remote {
    /**
     * Applies a `WorkspaceEdit` to the workspace
     * @param edit the workspace edit.
     * @return  a thenable that resolves to the `ApplyWorkspaceEditResponse`.
     */
    applyEdit(edit: WorkspaceEdit): Thenable<ApplyWorkspaceEditResponse>;
  }

  /**
   * Interface to log telemetry events. The events are actually send to the client
   * and the client needs to feed the event into a propert telemetry system.
   */
  declare export interface ITelemetry extends Remote {
    /**
     * Log the given data to telemetry.
     * @param data The data to log. Must be a JSON serializable object.
     */
    logEvent(data: any): void;
  }

  /**
   * Interface to log traces to the client. The events are sent to the client and the
   * client needs to log the trace events.
   */
  declare export interface Tracer extends Remote {
    /**
     * Log the given data to the trace Log
     */
    log(message: string, verbose?: string): void;
  }

  /**
   * Interface to describe the shape of the server connection.
   */
  declare export interface IConnection {
    /**
     * Start listening on the input stream for messages to process.
     */
    listen(): void;

    /**
     * Installs a request handler described by the given [RequestType](#RequestType).
     * @param type The [RequestType](#RequestType) describing the request.
     * @param handler The handler to install
     */
    onRequest<R, E, RO>(
      type: RequestType0<R, E, RO>,
      handler: RequestHandler0<R, E>,
    ): void;
    onRequest<P, R, E, RO>(
      type: RequestType<P, R, E, RO>,
      handler: RequestHandler<P, R, E>,
    ): void;

    /**
     * Installs a request handler for the given method.
     * @param method The method to register a request handler for.
     * @param handler The handler to install.
     */
    onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): void;

    /**
     * Installs a request handler that is invoked if no specific request handler can be found.
     * @param handler a handler that handles all requests.
     */
    onRequest(handler: StarRequestHandler): void;

    /**
     * Send a request to the client.
     * @param type The [RequestType](#RequestType) describing the request.
     * @param params The request's parameters.
     */
    sendRequest<R, E, RO>(
      type: RequestType0<R, E, RO>,
      token?: CancellationToken,
    ): Thenable<R>;
    sendRequest<P, R, E, RO>(
      type: RequestType<P, R, E, RO>,
      params: P,
      token?: CancellationToken,
    ): Thenable<R>;

    /**
     * Send a request to the client.
     * @param method The method to invoke on the client.
     * @param params The request's parameters.
     */
    sendRequest<R>(method: string, ...params: any[]): Thenable<R>;

    /**
     * Installs a notification handler described by the given [NotificationType](#NotificationType).
     * @param type The [NotificationType](#NotificationType) describing the notification.
     * @param handler The handler to install.
     */
    onNotification<RO>(
      type: NotificationType0<RO>,
      handler: NotificationHandler0,
    ): void;
    onNotification<P, RO>(
      type: NotificationType<P, RO>,
      handler: NotificationHandler<P>,
    ): void;

    /**
     * Installs a notification handler for the given method.
     * @param method The method to register a request handler for.
     * @param handler The handler to install.
     */
    onNotification(method: string, handler: GenericNotificationHandler): void;

    /**
     * Installs a notification handler that is invoked if no specific notification handler can be found.
     * @param handler a handler that handles all notifications.
     */
    onNotification(handler: StarNotificationHandler): void;

    /**
     * Send a notification to the client.
     * @param type The [NotificationType](#NotificationType) describing the notification.
     * @param params The notification's parameters.
     */
    sendNotification<RO>(type: NotificationType0<RO>): void;
    sendNotification<P, RO>(type: NotificationType<P, RO>, params?: P): void;

    /**
     * Send a notification to the client.
     * @param method The method to invoke on the client.
     * @param params The notification's parameters.
     */
    sendNotification(method: string, ...args: any[]): void;

    /**
     * Installs a handler for the intialize request.
     * @param handler The initialize handler.
     */
    onInitialize(
      handler: RequestHandler<
        InitializeParams,
        InitializeResult,
        InitializeError,
      >,
    ): void;

    /**
     * Installs a handler for the intialized notification.
     * @param handler The initialized handler.
     */
    onInitialized(handler: NotificationHandler<InitializedParams>): void;

    /**
     * Installs a handler for the shutdown request.
     * @param handler The initialize handler.
     */
    onShutdown(handler: RequestHandler0<void, void>): void;

    /**
     * Installs a handler for the exit notification.
     * @param handler The exit handler.
     */
    onExit(handler: NotificationHandler0): void;

    /**
     * A proxy for VSCode's development console. See [RemoteConsole](#RemoteConsole)
     */
    console: RemoteConsole;

    /**
     * A proxy to send trace events to the client.
     */
    tracer: Tracer;

    /**
     * A proxy to send telemetry events to the client.
     */
    telemetry: Telemetry;

    /**
     * A proxy interface for the language client interface to register for requests or
     * notifications.
     */
    client: RemoteClient;

    /**
     * A proxy for VSCode's window. See [RemoteWindow](#RemoteWindow)
     */
    window: RemoteWindow;

    /**
     * A proxy to talk to the client's workspace.
     */
    workspace: RemoteWorkspace;

    /**
     * Installs a handler for the `DidChangeConfiguration` notification.
     * @param handler The corresponding handler.
     */
    onDidChangeConfiguration(
      handler: NotificationHandler<DidChangeConfigurationParams>,
    ): void;

    /**
     * Installs a handler for the `DidChangeWatchedFiles` notification.
     * @param handler The corresponding handler.
     */
    onDidChangeWatchedFiles(
      handler: NotificationHandler<DidChangeWatchedFilesParams>,
    ): void;

    /**
     * Installs a handler for the `DidOpenTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onDidOpenTextDocument(
      handler: NotificationHandler<DidOpenTextDocumentParams>,
    ): void;

    /**
     * Installs a handler for the `DidChangeTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onDidChangeTextDocument(
      handler: NotificationHandler<DidChangeTextDocumentParams>,
    ): void;

    /**
     * Installs a handler for the `DidCloseTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onDidCloseTextDocument(
      handler: NotificationHandler<DidCloseTextDocumentParams>,
    ): void;

    /**
     * Installs a handler for the `DidSaveTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onWillSaveTextDocument(
      handler: NotificationHandler<WillSaveTextDocumentParams>,
    ): void;

    /**
     * Installs a handler for the `DidSaveTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onWillSaveTextDocumentWaitUntil(
      handler: RequestHandler<WillSaveTextDocumentParams, TextEdit[], void>,
    ): void;

    /**
     * Installs a handler for the `DidSaveTextDocument` notification.
     * @param handler The corresponding handler.
     */
    onDidSaveTextDocument(
      handler: NotificationHandler<DidSaveTextDocumentParams>,
    ): void;

    /**
     * Sends diagnostics computed for a given document to VSCode to render them in the
     * user interface.
     * @param params The diagnostic parameters.
     */
    sendDiagnostics(params: PublishDiagnosticsParams): void;

    /**
     * Installs a handler for the `Hover` request.
     * @param handler The corresponding handler.
     */
    onHover(
      handler: RequestHandler<TextDocumentPositionParams, IHover, void>,
    ): void;

    /**
     * Installs a handler for the `Completion` request.
     * @param handler The corresponding handler.
     */
    onCompletion(
      handler: RequestHandler<
        TextDocumentPositionParams,
        ICompletionItem[] | ICompletionList,
        void,
      >,
    ): void;

    /**
     * Installs a handler for the `CompletionResolve` request.
     * @param handler The corresponding handler.
     */
    onCompletionResolve(
      handler: RequestHandler<ICompletionItem, ICompletionItem, void>,
    ): void;

    /**
     * Installs a handler for the `SignatureHelp` request.
     * @param handler The corresponding handler.
     */
    onSignatureHelp(
      handler: RequestHandler<TextDocumentPositionParams, ISignatureHelp, void>,
    ): void;

    /**
     * Installs a handler for the `Definition` request.
     * @param handler The corresponding handler.
     */
    onDefinition(
      handler: RequestHandler<TextDocumentPositionParams, IDefinition, void>,
    ): void;

    /**
     * Installs a handler for the `References` request.
     * @param handler The corresponding handler.
     */
    onReferences(
      handler: RequestHandler<ReferenceParams, ILocation[], void>,
    ): void;

    /**
     * Installs a handler for the `DocumentHighlight` request.
     * @param handler The corresponding handler.
     */
    onDocumentHighlight(
      handler: RequestHandler<
        TextDocumentPositionParams,
        IDocumentHighlight[],
        void,
      >,
    ): void;

    /**
     * Installs a handler for the `DocumentSymbol` request.
     * @param handler The corresponding handler.
     */
    onDocumentSymbol(
      handler: RequestHandler<DocumentSymbolParams, ISymbolInformation[], void>,
    ): void;

    /**
     * Installs a handler for the `WorkspaceSymbol` request.
     * @param handler The corresponding handler.
     */
    onWorkspaceSymbol(
      handler: RequestHandler<
        WorkspaceSymbolParams,
        ISymbolInformation[],
        void,
      >,
    ): void;

    /**
     * Installs a handler for the `CodeAction` request.
     * @param handler The corresponding handler.
     */
    onCodeAction(
      handler: RequestHandler<CodeActionParams, ICommand[], void>,
    ): void;

    /**
       * Compute a list of [lenses](#CodeLens). This call should return as fast as possible and if
       * computing the commands is expensive implementors should only return code lens objects with the
      range set and handle the resolve request.
       * @param handler The corresponding handler.
      */
    onCodeLens(
      handler: RequestHandler<CodeLensParams, ICodeLens[], void>,
    ): void;

    /**
     * This function will be called for each visible code lens, usually when scrolling and after
     * the onCodeLens has been called.
     * @param handler The corresponding handler.
     */
    onCodeLensResolve(
      handler: RequestHandler<ICodeLens, ICodeLens, void>,
    ): void;

    /**
     * Installs a handler for the document formatting request.
     * @param handler The corresponding handler.
     */
    onDocumentFormatting(
      handler: RequestHandler<DocumentFormattingParams, TextEdit[], void>,
    ): void;

    /**
     * Installs a handler for the document range formatting request.
     * @param handler The corresponding handler.
     */
    onDocumentRangeFormatting(
      handler: RequestHandler<DocumentRangeFormattingParams, TextEdit[], void>,
    ): void;

    /**
     * Installs a handler for the document on type formatting request.
     * @param handler The corresponding handler.
     */
    onDocumentOnTypeFormatting(
      handler: RequestHandler<DocumentOnTypeFormattingParams, TextEdit[], void>,
    ): void;

    /**
     * Installs a handler for the rename request.
     * @param handler The corresponding handler.
     */
    onRenameRequest(
      handler: RequestHandler<RenameParams, WorkspaceEdit, void>,
    ): void;

    /**
     * Installs a handler for the document links request.
     * @param handler The corresponding handler.
     */
    onDocumentLinks(
      handler: RequestHandler<DocumentLinkParams, DocumentLink[], void>,
    ): void;

    /**
     * Installs a handler for the document links resolve request.
     * @param handler The corresponding handler.
     */
    onDocumentLinkResolve(
      handler: RequestHandler<DocumentLink, DocumentLink, void>,
    ): void;

    /**
     * Installs a handler for the execute command request.
     * @param handler The corresponding handler.
     */
    onExecuteCommand(
      handler: RequestHandler<ExecuteCommandParams, any, void>,
    ): void;

    /**
     * Disposes the connection
     */
    dispose(): void;
  }

  // declare export interface IConnection extends Connection<*> {}

  declare export interface Feature<B, P> {
    (Base: () => B): () => B & P;
  }
  declare export type ConsoleFeature<P> = Feature<RemoteConsole, P>;
  declare export function combineConsoleFeatures<O, T>(
    one: ConsoleFeature<O>,
    two: ConsoleFeature<T>,
  ): ConsoleFeature<O & T>;
  declare export type TelemetryFeature<P> = Feature<Telemetry, P>;
  declare export function combineTelemetryFeatures<O, T>(
    one: TelemetryFeature<O>,
    two: TelemetryFeature<T>,
  ): TelemetryFeature<O & T>;

  declare export type TracerFeature<P> = Feature<Tracer, P>;
  declare export function combineTracerFeatures<O, T>(
    one: TracerFeature<O>,
    two: TracerFeature<T>,
  ): TracerFeature<O & T>;
  declare export type ClientFeature<P> = Feature<RemoteClient, P>;
  declare export function combineClientFeatures<O, T>(
    one: ClientFeature<O>,
    two: ClientFeature<T>,
  ): ClientFeature<O & T>;
  declare export type WindowFeature<P> = Feature<RemoteWindow, P>;
  declare export function combineWindowFeatures<O, T>(
    one: WindowFeature<O>,
    two: WindowFeature<T>,
  ): WindowFeature<O & T>;
  declare export type WorkspaceFeature<P> = Feature<RemoteWorkspace, P>;
  declare export function combineWorkspaceFeatures<O, T>(
    one: WorkspaceFeature<O>,
    two: WorkspaceFeature<T>,
  ): WorkspaceFeature<O & T>;
  declare export interface Features<
    PConsole,
    _,
    PTracer,
    _,
    PTelemetry,
    _,
    PClient,
    _,
    PWindow,
    _,
    PWorkspace,
    _,
  > {
    ___brand: features;
    console?: ConsoleFeature<PConsole>;
    tracer?: TracerFeature<PTracer>;
    telemetry?: TelemetryFeature<PTelemetry>;
    client?: ClientFeature<PClient>;
    window?: WindowFeature<PWindow>;
    workspace?: WorkspaceFeature<PWorkspace>;
  }
  declare export function combineFeatures<
    OConsole,
    OTracer,
    OTelemetry,
    OClient,
    OWindow,
    OWorkspace,
    TConsole,
    TTracer,
    TTelemetry,
    TClient,
    TWindow,
    TWorkspace,
  >(
    one: Features<OConsole, OTracer, OTelemetry, OClient, OWindow, OWorkspace>,
    two: Features<TConsole, TTracer, TTelemetry, TClient, TWindow, TWorkspace>,
  ): Features<
    OConsole & TConsole,
    OTracer & TTracer,
    OTelemetry & TTelemetry,
    OClient & TClient,
    OWindow & TWindow,
    OWorkspace & TWorkspace,
  >;

  /**
   * Creates a new connection based on the processes command line arguments:
   * @param strategy An optional connection strategy to control additinal settings
   */
  declare export function createConnection(
    strategy?: ConnectionStrategy,
  ): IConnection;

  declare export function createConnection(
    reader: stream$Readable,
    writer: stream$Writable,
    strategy?: ConnectionStrategy,
  ): IConnection;
  /**
   * Creates a new connection.
   *
   * @param reader The message reader to read messages from.
   * @param writer The message writer to write message to.
   * @param strategy An optional connection strategy to control additinal settings
   */
  declare export function createConnection(
    reader: MessageReader,
    writer: MessageWriter,
    strategy?: ConnectionStrategy,
  ): IConnection;

  // declare type ProposedFeatures$Configuration = config.Configuration;

  // declare var ConfigurationFeature: Feature<
  //   RemoteWorkspace,
  //   config.Configuration,
  // >;

  // declare type ProposedFeatures$WorkspaceFolders = folders.WorkspaceFolders;

  // declare var WorkspaceFoldersFeature: Feature<
  //   RemoteWorkspace,
  //   folders.WorkspaceFolders,
  // >;

  // declare var all: Features<
  //   _,
  //   _,
  //   _,
  //   _,
  //   _,
  //   ProposedFeatures$WorkspaceFolders & ProposedFeatures$Configuration,
  // >;
}
