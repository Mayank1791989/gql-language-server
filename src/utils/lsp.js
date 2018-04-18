/* @flow */
export {
  Diagnostic,
  DiagnosticSeverity,
  CompletionItemKind,
  Location,
  Position,
  Range,
  TextDocumentChangeEvent,
  TextDocumentContentChangeEvent,
} from 'vscode-languageserver-types';

export type {
  IPosition,
  IRange,
  ILocation,
  IDiagnostic,
  ICompletionList,
  ICompletionItem,
  ITextDocumentItem,
  DiagnosticSeverityType,
  IHover,
} from 'vscode-languageserver-types';

export {
  DidOpenTextDocumentNotification,
  DidChangeTextDocumentNotification,
  DidCloseTextDocumentNotification,
  CompletionRequest,
  HoverRequest,
  DefinitionRequest,
  ReferencesRequest,
  TextDocumentSyncKind,
} from 'vscode-languageserver-protocol';

export type {
  TextDocumentPositionParams,
  PublishDiagnosticsParams,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidOpenTextDocumentParams,
  DidSaveTextDocumentParams,
  TextDocumentSyncKindType,
} from 'vscode-languageserver-protocol';

export type { IConnection } from 'vscode-languageserver';

export { BulkRegistration, createConnection } from 'vscode-languageserver';
