declare module 'vscode-languageserver-protocol' {
  import type {
    IPosition,
    ILocation,
    IRange,
    ITextDocumentIdentifier,
    IVersionedTextDocumentIdentifier,
    ITextDocumentItem,
    IDiagnostic,
    ITextEdit,
    ICompletionList,
    ICompletionItem,
    IDefinition,
    IHover,
    ISignatureHelp,
    IDocumentHighlight,
    ISymbolInformation,
    ICodeActionContext,
    ICommand,
    ICodeLens,
    IFormattingOptions,
    WorkspaceEdit,
    ReferenceContext,
    DocumentSymbolParams,
    WorkspaceSymbolParams,
    TextDocumentContentChangeEvent,
  } from 'vscode-languageserver-types';

  import type {
    RequestType,
    RequestType0,
    NotificationType,
    NotificationType0,
  } from 'vscode-jsonrpc';

  /**
   * A document filter denotes a document by different properties like
   * the [language](#TextDocument.languageId), the [scheme](#Uri.scheme) of
   * its resource, or a glob-pattern that is applied to the [path](#TextDocument.fileName).
   * @sample  A language filter that applies to typescript files on disk: `{ language: 'typescript', scheme: 'file' }`
   * @sample  A language filter that applies to all package.json paths: `{ language: 'json', pattern: '**package.json' }`
   */
  declare export type IDocumentFilter =
    | {
        /**
         * A language id, like `typescript`.
         */
        language: string,

        /**
         * A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
         */
        scheme?: string,

        /**
         * A glob pattern, like `.{ts,js}`.
         */
        pattern?: string,
      }
    | {
        /**
         * A language id, like `typescript`.
         */
        language?: string,

        /**
         * A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
         */
        scheme: string,

        /**
         * A glob pattern, like `.{ts,js}`.
         */
        pattern?: string,
      }
    | {
        /**
         * A language id, like `typescript`.
         */
        language?: string,

        /**
         * A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
         */
        scheme?: string,

        /**
         * A glob pattern, like `.{ts,js}`.
         */
        pattern: string,
      };

  declare var DocumentFilter: {
    is(value: any): IDocumentFilter,
  };
  /**
   * A document selector is the combination of one or many document filters.
   * @sample  `let sel:DocumentSelector = [{ language: 'typescript' }, { language: 'json', pattern: '**∕tsconfig.json' }]`;
   */
  declare export type DocumentSelector = (string | IDocumentFilter)[];
  /**
   * General paramters to to regsiter for an notification or to register a provider.
   */
  declare export interface Registration {
    /**
     * The id used to register the request. The id can be used to deregister
     * the request again.
     */
    id: string;

    /**
     * The method to register for.
     */
    method: string;

    /**
     * Options necessary for the registration.
     */
    registerOptions?: any;
  }
  declare export interface RegistrationParams {
    registrations: Registration[];
  }
  declare var type: RequestType<RegistrationParams, void, void, void>;
  /**
   * General parameters to unregister a request or notification.
   */
  declare export interface Unregistration {
    /**
     * The id used to unregister the request or notification. Usually an id
     * provided during the register request.
     */
    id: string;

    /**
     * The method to unregister for.
     */
    method: string;
  }
  declare export interface UnregistrationParams {
    unregisterations: Unregistration[];
  }
  declare var type: RequestType<UnregistrationParams, void, void, void>;
  /**
   * A parameter literal used in requests to pass a text document and a position inside that
   * document.
   */
  declare export type TextDocumentPositionParams = {
    /**
     * The text document.
     */
    textDocument: ITextDocumentItem,

    /**
     * The position inside the text document.
     */
    position: IPosition,
  };

  /**
   * Workspace specific client capabilities.
   */
  declare export interface WorkspaceClientCapabilities {
    /**
     * The client supports applying batch edits
     * to the workspace by supporting the request
    'workspace/applyEdit'
    */
    applyEdit?: boolean;

    /**
     * Capabilities specific to `WorkspaceEdit`s
     */
    workspaceEdit?: {
      /**
       * The client supports versioned document changes in `WorkspaceEdit`s
       */
      documentChanges?: boolean,
    };

    /**
     * Capabilities specific to the `workspace/didChangeConfiguration` notification.
     */
    didChangeConfiguration?: {
      /**
       * Did change configuration notification supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `workspace/didChangeWatchedFiles` notification.
     */
    didChangeWatchedFiles?: {
      /**
       * Did change watched files notification supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `workspace/symbol` request.
     */
    symbol?: {
      /**
       * Symbol request supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `workspace/executeCommand` request.
     */
    executeCommand?: {
      /**
       * Execute command supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };
  }

  /**
   * This is for backwards compatibility. Can be removed when we switch to 4.0.
   */
  declare export type WorkspaceClientCapabilites = WorkspaceClientCapabilities;

  /**
   * Text document specific client capabilities.
   */
  declare export interface TextDocumentClientCapabilities {
    /**
     * Defines which synchronization capabilities the client supports.
     */
    synchronization?: {
      /**
       * Whether text document synchronization supports dynamic registration.
       */
      dynamicRegistration?: boolean,

      /**
       * The client supports sending will save notifications.
       */
      willSave?: boolean,

      /**
             * The client supports sending a will save request and
             * waits for a response providing text edits which will
            be applied to the document before it is saved.
            */
      willSaveWaitUntil?: boolean,

      /**
       * The client supports did save notifications.
       */
      didSave?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/completion`
     */
    completion?: {
      /**
       * Whether completion supports dynamic registration.
       */
      dynamicRegistration?: boolean,

      /**
       * The client supports the following `CompletionItem` specific
       * capabilities.
       */
      completionItem?: {
        /**
                 * Client supports snippets as insert text.
                 *
                A snippet can define tab stops and placeholders with `$1`, `$2`
                and `${3:foo}`. `$0` defines the final tab stop, it defaults to
                the end of the snippet. Placeholders with equal identifiers are linked,
                that is typing in one will update others too.
                */
        snippetSupport?: boolean,

        /**
         * Client supports commit characters on a completion item.
         */
        commitCharactersSupport?: boolean,
      },
    };

    /**
     * Capabilities specific to the `textDocument/hover`
     */
    hover?: {
      /**
       * Whether hover supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/signatureHelp`
     */
    signatureHelp?: {
      /**
       * Whether signature help supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/references`
     */
    references?: {
      /**
       * Whether references supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/documentHighlight`
     */
    documentHighlight?: {
      /**
       * Whether document highlight supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/documentSymbol`
     */
    documentSymbol?: {
      /**
       * Whether document symbol supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/formatting`
     */
    formatting?: {
      /**
       * Whether formatting supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/rangeFormatting`
     */
    rangeFormatting?: {
      /**
       * Whether range formatting supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/onTypeFormatting`
     */
    onTypeFormatting?: {
      /**
       * Whether on type formatting supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/definition`
     */
    definition?: {
      /**
       * Whether definition supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/codeAction`
     */
    codeAction?: {
      /**
       * Whether code action supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/codeLens`
     */
    codeLens?: {
      /**
       * Whether code lens supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/documentLink`
     */
    documentLink?: {
      /**
       * Whether document link supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };

    /**
     * Capabilities specific to the `textDocument/rename`
     */
    rename?: {
      /**
       * Whether rename supports dynamic registration.
       */
      dynamicRegistration?: boolean,
    };
  }

  /**
   * Defines the capabilities provided by the client.
   */
  declare export interface ClientCapabilities {
    /**
     * Workspace specific client capabilities.
     */
    workspace?: WorkspaceClientCapabilities;

    /**
     * Text document specific client capabilities.
     */
    textDocument?: TextDocumentClientCapabilities;

    /**
     * Experimental client capabilities.
     */
    experimental?: any;
  }

  declare export var TextDocumentSyncKind: {
    None: 0,
    Full: 1,
    Incremental: 2,
  };
  declare export type TextDocumentSyncKindType = 0 | 1 | 2;

  /**
   * General text document registration options.
   */
  declare export interface TextDocumentRegistrationOptions {
    /**
     * A document selector to identify the scope of the registration. If set to null
     * the document selector provided on the client side will be used.
     */
    documentSelector: DocumentSelector | null;
  }

  /**
   * Completion options.
   */
  declare export type CompletionOptions = {
    /**
     * The server provides support to resolve additional
     * information for a completion item.
     */
    resolveProvider?: boolean,

    /**
     * The characters that trigger completion automatically.
     */
    triggerCharacters?: string[],
  };

  /**
   * Signature help options.
   */
  declare export interface SignatureHelpOptions {
    /**
     * The characters that trigger signature help
     * automatically.
     */
    triggerCharacters?: string[];
  }

  /**
   * Code Lens options.
   */
  declare export type CodeLensOptions = {
    /**
     * Code lens has a resolve provider as well.
     */
    resolveProvider?: boolean,
  };

  /**
   * Format document on type options
   */
  declare export type DocumentOnTypeFormattingOptions = {
    /**
     * A character on which formatting should be triggered, like `}`.
     */
    firstTriggerCharacter: string,

    /**
     * More trigger characters.
     */
    moreTriggerCharacter?: string[],
  };

  /**
   * Document link options
   */
  declare export type DocumentLinkOptions = {
    /**
     * Document links have a resolve provider as well.
     */
    resolveProvider?: boolean,
  };

  /**
   * Execute command options.
   */
  declare export type ExecuteCommandOptions = {
    /**
     * The commands to be executed on the server
     */
    commands: string[],
  };

  /**
   * Save options.
   */
  declare export type SaveOptions = {
    /**
     * The client is supposed to include the content on save.
     */
    includeText?: boolean,
  };

  declare export type TextDocumentSyncOptions = {
    /**
     * Open and close notifications are sent to the server.
     */
    openClose?: boolean,

    /**
     * Change notificatins are sent to the server. See TextDocumentSyncKind.None, TextDocumentSyncKind.Full
     * and TextDocumentSyncKindIncremental.
     */
    change?: TextDocumentSyncKindType,

    /**
     * Will save notifications are sent to the server.
     */
    willSave?: boolean,

    /**
     * Will save wait until requests are sent to the server.
     */
    willSaveWaitUntil?: boolean,

    /**
     * Save notifications are sent to the server.
     */
    save?: SaveOptions,
  };

  /**
   * Defines the capabilities provided by a language
   * server.
   */
  declare export interface ServerCapabilities {
    /**
     * Defines how text documents are synced. Is either a detailed structure defining each notification or
     * for backwards compatibility the TextDocumentSyncKind number.
     */
    textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKindType;

    /**
     * The server provides hover support.
     */
    hoverProvider?: boolean;

    /**
     * The server provides completion support.
     */
    completionProvider?: CompletionOptions;

    /**
     * The server provides signature help support.
     */
    signatureHelpProvider?: SignatureHelpOptions;

    /**
     * The server provides goto definition support.
     */
    definitionProvider?: boolean;

    /**
     * The server provides find references support.
     */
    referencesProvider?: boolean;

    /**
     * The server provides document highlight support.
     */
    documentHighlightProvider?: boolean;

    /**
     * The server provides document symbol support.
     */
    documentSymbolProvider?: boolean;

    /**
     * The server provides workspace symbol support.
     */
    workspaceSymbolProvider?: boolean;

    /**
     * The server provides code actions.
     */
    codeActionProvider?: boolean;

    /**
     * The server provides code lens.
     */
    codeLensProvider?: CodeLensOptions;

    /**
     * The server provides document formatting.
     */
    documentFormattingProvider?: boolean;

    /**
     * The server provides document range formatting.
     */
    documentRangeFormattingProvider?: boolean;

    /**
     * The server provides document formatting on typing.
     */
    documentOnTypeFormattingProvider?: {
      /**
       * A character on which formatting should be triggered, like `}`.
       */
      firstTriggerCharacter: string,

      /**
       * More trigger characters.
       */
      moreTriggerCharacter?: string[],
    };

    /**
     * The server provides rename support.
     */
    renameProvider?: boolean;

    /**
     * The server provides document link support.
     */
    documentLinkProvider?: DocumentLinkOptions;

    /**
     * The server provides execute command support.
     */
    executeCommandProvider?: ExecuteCommandOptions;

    /**
     * Experimental server capabilities.
     */
    experimental?: any;
  }

  /**
   * The initialize parameters
   */
  declare export type InitializeParams = {
    /**
     * The process Id of the parent process that started
     * the server.
     */
    processId: number,

    /**
     * The rootPath of the workspace. Is null
     * if no folder is open.
     * @deprecated  in favour of rootUri.
     */
    rootPath?: string | null,

    /**
         * The rootUri of the workspace. Is null if no
         * folder is open. If both `rootPath` and `rootUri` are set
        `rootUri` wins.
        */
    rootUri: string | null,

    /**
     * The capabilities provided by the client (editor or tool)
     */
    capabilities: ClientCapabilities,

    /**
     * User provided initialization options.
     */
    initializationOptions?: any,

    /**
     * The initial trace setting. If omitted trace is disabled ('off').
     */
    trace?: 'off' | 'messages' | 'verbose',
  };

  /**
   * The result returned from an initilize request.
   */
  declare export type InitializeResult = {
    /**
     * The capabilities the language server provides.
     */
    capabilities: ServerCapabilities,
    [custom: string]: any,
  };

  declare var unknownProtocolVersion: number;

  /**
   * The data type of the ResponseError if the
   * initialize request fails.
   */
  declare export type InitializeError = {
    /**
     * Indicates whether the client execute the following retry logic:
     * (1) show the message provided by the ResponseError to the user
     * (2) user selects retry or cancel
     * (3) if user selected retry the initialize method is sent again.
     */
    retry: boolean,
  };

  declare export var InitializeRequest: {
    type: RequestType<
      InitializeParams,
      InitializeResult,
      InitializeError,
      void,
    >,
  };

  declare export interface InitializedParams {}
  declare export var InitializedNotification: {
    type: NotificationType<InitializedParams, void>,
  };
  declare export var ShutdownRequest: {
    type: RequestType0<void, void, void>,
  };
  declare export var ExitNotification: {
    type: NotificationType0<void>,
  };

  /**
   * The parameters of a change configuration notification.
   */
  declare export type DidChangeConfigurationParams = {
    /**
     * The actual changed settings
     */
    settings: any,
  };

  declare export type DidChangeConfigurationRegistrationOptions = {
    section?: string | string[],
  };

  declare export var DidChangeConfigurationNotification: {
    type: NotificationType<
      DidChangeConfigurationParams,
      DidChangeConfigurationRegistrationOptions,
    >,
  };

  declare export var MessageType: {
    Error: 0,
    Warning: 1,
    Info: 2,
    Log: 3,
  };
  declare export type MessageTypeValue = 1 | 2 | 3 | 4;

  /**
   * The parameters of a notification message.
   */
  declare export interface ShowMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageTypeValue;

    /**
     * The actual message
     */
    message: string;
  }
  declare export var ShowMessageNotification: {
    type: NotificationType<ShowMessageParams, void>,
  };
  declare export interface MessageActionItem {
    /**
     * A short title like 'Retry', 'Open Log' etc.
     */
    title: string;
  }

  declare export interface ShowMessageRequestParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageTypeValue;

    /**
     * The actual message
     */
    message: string;

    /**
     * The message action items to present.
     */
    actions?: MessageActionItem[];
  }

  declare export var ShowMessageRequest: {
    type: RequestType<ShowMessageRequestParams, MessageActionItem, void, void>,
  };

  /**
   * The log message parameters.
   */
  declare export interface LogMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: MessageTypeValue;

    /**
     * The actual message
     */
    message: string;
  }

  declare export var LogMessageNotification: {
    type: NotificationType<LogMessageParams, void>,
  };

  declare export var TelemetryEventNotification: {
    type: NotificationType<any, void>,
  };

  /**
   * The parameters send in a open text document notification
   */
  declare export type DidOpenTextDocumentParams = {
    /**
     * The document that was opened.
     */
    textDocument: ITextDocumentItem,
  };

  declare export var DidOpenTextDocumentNotification: {
    type: NotificationType<
      DidOpenTextDocumentParams,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * The change text document notification's parameters.
   */
  declare export type DidChangeTextDocumentParams = {
    /**
     * The document that did change. The version number points
     * to the version after all provided content changes have
    been applied.
    */
    textDocument: IVersionedTextDocumentIdentifier,

    /**
         * The actual content changes. The content changes descibe single state changes
         * to the document. So if there are two content changes c1 and c2 for a document
        in state S10 then c1 move the document to S11 and c2 to S12.
        */
    contentChanges: TextDocumentContentChangeEvent[],
  };

  /**
   * Descibe options to be used when registered for text document change events.
   */
  declare export type TextDocumentChangeRegistrationOptions = {
    /**
     * How documents are synced to the server.
     */
    syncKind: TextDocumentSyncKindType,
  } & TextDocumentRegistrationOptions;

  declare export var DidChangeTextDocumentNotification: {
    type: NotificationType<
      DidChangeTextDocumentParams,
      TextDocumentChangeRegistrationOptions,
    >,
  };

  /**
   * The parameters send in a close text document notification
   */
  declare export type DidCloseTextDocumentParams = {
    /**
     * The document that was closed.
     */
    textDocument: ITextDocumentIdentifier,
  };

  declare export var DidCloseTextDocumentNotification: {
    type: NotificationType<
      DidCloseTextDocumentParams,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * The parameters send in a save text document notification
   */
  declare export type DidSaveTextDocumentParams = {
    /**
     * The document that was closed.
     */
    textDocument: IVersionedTextDocumentIdentifier,

    /**
     * Optional the content when saved. Depends on the includeText value
     * when the save notifcation was requested.
     */
    text?: string,
  };

  /**
   * Save registration options.
   */
  declare export type TextDocumentSaveRegistrationOptions = {} & TextDocumentRegistrationOptions &
    SaveOptions;

  declare export var DidSaveTextDocumentNotification: {
    type: NotificationType<
      DidSaveTextDocumentParams,
      TextDocumentSaveRegistrationOptions,
    >,
  };

  /**
   * The parameters send in a will save text document notification.
   */
  declare export interface WillSaveTextDocumentParams {
    /**
     * The document that will be saved.
     */
    textDocument: ITextDocumentIdentifier;

    /**
     * The 'TextDocumentSaveReason'.
     */
    reason: TextDocumentSaveReason;
  }

  declare export var WillSaveTextDocumentNotification: {
    type: NotificationType<
      WillSaveTextDocumentParams,
      TextDocumentRegistrationOptions,
    >,
  };

  declare export var WillSaveTextDocumentWaitUntilRequest: {
    type: RequestType<
      WillSaveTextDocumentParams,
      ITextEdit[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * The watched files change notification's parameters.
   */
  declare export interface DidChangeWatchedFilesParams {
    /**
     * The actual file events.
     */
    changes: FileEvent[];
  }
  declare export var DidChangeWatchedFilesNotification: {
    type: NotificationType<DidChangeWatchedFilesParams, void>,
  };

  declare export var FileChangeKind: {
    Created: 1,
    Changed: 2,
    Deleted: 3,
  };
  declare export type FileChangeType = 1 | 2 | 3;

  /**
   * An event describing a file change.
   */
  declare export interface FileEvent {
    /**
     * The file's uri.
     */
    uri: string;

    /**
     * The change type.
     */
    type: FileChangeType;
  }
  /**
   * Descibe options to be used when registered for text document change events.
   */
  declare export interface DidChangeWatchedFilesRegistrationOptions {
    /**
     * The watchers to register.
     */
    watchers: FileSystemWatcher[];
  }

  declare export interface FileSystemWatcher {
    /**
     * The  glob pattern to watch
     */
    globPattern: string;

    /**
     * The kind of events of interest. If omitted it defaults
     * to WatchKind.Create | WatchKind.Change | WatchKind.Delete
     * which is 7.
     */
    kind?: WatchKindType;
  }

  declare export var WatchKind: {
    Create: 0,
    Change: 1,
    Delete: 4,
  };
  declare export type WatchKindType = 0 | 1 | 4;

  /**
   * The publish diagnostic notification's parameters.
   */
  declare export type PublishDiagnosticsParams = {
    /**
     * The URI for which diagnostic information is reported.
     */
    uri: string,

    /**
     * An array of diagnostic information items.
     */
    diagnostics: IDiagnostic[],
  };
  declare export var PublishDiagnosticsNotification: {
    type: NotificationType<PublishDiagnosticsParams, void>,
  };

  /**
   * Completion registration options.
   */
  declare export type CompletionRegistrationOptions = {} & TextDocumentRegistrationOptions &
    CompletionOptions;
  declare export var CompletionRequest: {
    type: RequestType<
      TextDocumentPositionParams,
      ICompletionList | ICompletionItem[],
      void,
      CompletionRegistrationOptions,
    >,
  };

  declare export var CompletionResolveRequest: {
    type: RequestType<ICompletionItem, ICompletionItem, void, void>,
  };
  declare export var HoverRequest: {
    type: RequestType<
      TextDocumentPositionParams,
      IHover,
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * Signature help registration options.
   */
  declare export type SignatureHelpRegistrationOptions = {} & TextDocumentRegistrationOptions &
    SignatureHelpOptions;
  declare export var SignatureHelpRequest: {
    type: RequestType<
      TextDocumentPositionParams,
      ISignatureHelp,
      void,
      SignatureHelpRegistrationOptions,
    >,
  };
  declare export var DefinitionRequest: {
    type: RequestType<
      TextDocumentPositionParams,
      IDefinition,
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * Parameters for a [ReferencesRequest](#ReferencesRequest).
   */
  declare export type ReferenceParams = {
    context: ReferenceContext,
  } & TextDocumentPositionParams;

  declare export var ReferencesRequest: {
    type: RequestType<
      ReferenceParams,
      ILocation[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };
  declare export var DocumentHighlightRequest: {
    type: RequestType<
      TextDocumentPositionParams,
      IDocumentHighlight[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };
  declare export var DocumentSymbolRequest: {
    type: RequestType<
      DocumentSymbolParams,
      ISymbolInformation[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };
  declare export var WorkspaceSymbolRequest: {
    type: RequestType<WorkspaceSymbolParams, ISymbolInformation[], void, void>,
  };

  /**
   * Params for the CodeActionRequest
   */
  declare export interface CodeActionParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: ITextDocumentIdentifier;

    /**
     * The range for which the command was invoked.
     */
    range: IRange;

    /**
     * Context carrying additional information.
     */
    context: ICodeActionContext;
  }
  declare export var CodeActionRequest: {
    type: RequestType<
      CodeActionParams,
      ICommand[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  /**
   * Params for the Code Lens request.
   */
  declare export interface CodeLensParams {
    /**
     * The document to request code lens for.
     */
    textDocument: ITextDocumentIdentifier;
  }
  /**
   * Code Lens registration options.
   */
  declare export type CodeLensRegistrationOptions = {} & TextDocumentRegistrationOptions &
    CodeLensOptions;

  declare export var CodeLensRequest: {
    type: RequestType<
      CodeLensParams,
      ICodeLens[],
      void,
      CodeLensRegistrationOptions,
    >,
  };
  /**
   * A request to resolve a command for a given code lens.
   */
  declare export var CodeLensResolveRequest: {
    type: RequestType<ICodeLens, ICodeLens, void, void>,
  };

  declare export type DocumentFormattingParams = {
    /**
     * The document to format.
     */
    textDocument: ITextDocumentIdentifier,

    /**
     * The format options
     */
    options: IFormattingOptions,
  };
  declare export var DocumentFormattingRequest: {
    type: RequestType<
      DocumentFormattingParams,
      TextEdit[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  declare export interface DocumentRangeFormattingParams {
    /**
     * The document to format.
     */
    textDocument: ITextDocumentIdentifier;

    /**
     * The range to format
     */
    range: IRange;

    /**
     * The format options
     */
    options: IFormattingOptions;
  }
  declare export var DocumentRangeFormattingRequest: {
    type: RequestType<
      DocumentRangeFormattingParams,
      TextEdit[],
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  declare export type DocumentOnTypeFormattingParams = {
    /**
     * The document to format.
     */
    textDocument: ITextDocumentIdentifier,

    /**
     * The position at which this request was send.
     */
    position: Position,

    /**
     * The character that has been typed.
     */
    ch: string,

    /**
     * The format options.
     */
    options: IFormattingOptions,
  };

  /**
   * Format document on type options
   */
  declare export type DocumentOnTypeFormattingRegistrationOptions = {} & TextDocumentRegistrationOptions &
    DocumentOnTypeFormattingOptions;

  declare export var DocumentOnTypeFormattingRequest: {
    type: RequestType<
      DocumentOnTypeFormattingParams,
      TextEdit[],
      void,
      DocumentOnTypeFormattingRegistrationOptions,
    >,
  };

  declare export interface RenameParams {
    /**
     * The document to rename.
     */
    textDocument: ITextDocumentIdentifier;

    /**
     * The position at which this request was sent.
     */
    position: Position;

    /**
     * The new name of the symbol. If the given name is not valid the
     * request must return a [ResponseError](#ResponseError) with an
     * appropriate message set.
     */
    newName: string;
  }

  declare export var RenameRequest: {
    type: RequestType<
      RenameParams,
      WorkspaceEdit,
      void,
      TextDocumentRegistrationOptions,
    >,
  };

  declare export type DocumentLinkParams = {
    /**
     * The document to provide document links for.
     */
    textDocument: ITextDocumentIdentifier,
  };

  /**
   * Document link registration options
   */
  declare export type DocumentLinkRegistrationOptions = {} & TextDocumentRegistrationOptions &
    DocumentLinkOptions;

  declare export var DocumentLinkRequest: {
    type: RequestType<
      DocumentLinkParams,
      DocumentLink[],
      void,
      DocumentLinkRegistrationOptions,
    >,
  };

  /**
   * Request to resolve additional information for a given document link. The request's
   * parameter is of type [DocumentLink](#DocumentLink) the response
   * is of type [DocumentLink](#DocumentLink) or a Thenable that resolves to such.
   */
  declare export var DocumentLinkResolveRequest: {
    type: RequestType<DocumentLink, DocumentLink, void, void>,
  };

  declare export type ExecuteCommandParams = {
    /**
     * The identifier of the actual command handler.
     */
    command: string,

    /**
     * Arguments that the command should be invoked with.
     */
    arguments?: any[],
  };
  /**
   * Execute command registration options.
   */
  declare export type ExecuteCommandRegistrationOptions = {} & ExecuteCommandOptions;
  declare export var ExecuteCommandRequest: {
    type: RequestType<
      ExecuteCommandParams,
      any,
      void,
      ExecuteCommandRegistrationOptions,
    >,
  };
  /**
   * The parameters passed via a apply workspace edit request.
   */
  declare export interface ApplyWorkspaceEditParams {
    /**
     * The edits to apply.
     */
    edit: WorkspaceEdit;
  }
  /**
   * A reponse returned from the apply workspace edit request.
   */
  declare export interface ApplyWorkspaceEditResponse {
    /**
     * Indicates whether the edit was applied or not.
     */
    applied: boolean;
  }
  declare export var ApplyWorkspaceEditRequest: {
    type: RequestType<
      ApplyWorkspaceEditParams,
      ApplyWorkspaceEditResponse,
      void,
      void,
    >,
  };
}
