/* @flow */
import {
  type DidChangeTextDocumentParams,
  type DidCloseTextDocumentParams,
  type DidOpenTextDocumentParams,
  type DidSaveTextDocumentParams,
  type IConnection,
  type TextDocumentSyncKindType,
  type TextDocumentChangeEvent,
  type ITextDocumentItem,
  TextDocumentSyncKind,
} from './lsp';

import invariant from 'assert';
import TextDocument from './TextDocument';
import UniversalDisposable from './UniversalDisposable';
import { Emitter } from 'event-kit';
import { getLogger } from 'log4js';

const logger = getLogger('gql-language-server');

function textDocumentFromLSPTextDocument(textDocument: ITextDocumentItem) {
  return new TextDocument(
    textDocument.uri,
    textDocument.languageId,
    textDocument.version,
    textDocument.text,
  );
}

export default class TextDocuments {
  _disposables = new UniversalDisposable();
  _documents: Map<string, TextDocument> = new Map();
  _emitter: Emitter = new Emitter();

  constructor() {
    this._disposables.add(this._emitter);
  }

  dispose(): void {
    this._disposables.dispose();
  }

  get disposed(): boolean {
    return this._disposables.disposed;
  }

  get syncKind(): TextDocumentSyncKindType {
    return TextDocumentSyncKind.Incremental;
  }

  get(uri: string): TextDocument {
    const document = this._documents.get(uri);

    invariant(
      document != null,
      `TextDocuments: asked for document with uri ${uri}, but no buffer was loaded`,
    );

    return document;
  }

  listen(connection: IConnection): void {
    connection.onDidOpenTextDocument((e: DidOpenTextDocumentParams) => {
      logger.debug(`@onDidOpenTextDocument: ${e.textDocument.uri}`);
      const { textDocument } = e;
      const document = textDocumentFromLSPTextDocument(textDocument);
      this.addDocument(textDocument.uri, document);
    });

    connection.onDidChangeTextDocument((e: DidChangeTextDocumentParams) => {
      logger.debug(`@onDidChangeTextDocument: ${e.textDocument.uri}`);
      const { contentChanges, textDocument } = e;
      const document = this.get(textDocument.uri);
      document.updateMany(contentChanges, textDocument.version);
    });

    connection.onDidCloseTextDocument((e: DidCloseTextDocumentParams) => {
      logger.debug(`@onDidCloseTextDocument: ${e.textDocument.uri}`);
      this.removeDocument(e.textDocument.uri);
    });

    connection.onDidSaveTextDocument((e: DidSaveTextDocumentParams) => {
      logger.debug(`@onDidSaveTextDocument: ${e.textDocument.uri}`);
      const document = this.get(e.textDocument.uri);
      document.save(e.text);
    });
  }

  addDocument(uri: string, document: TextDocument) {
    logger.debug(`TextDocuments: adding document ${uri}`);
    this._documents.set(uri, document);
    this._disposables.add(document);
    this._emitter.emit('didOpen', { document });
    document.onDidStopChanging(this._handleDidStopChanging);
    document.onDidSave(this._handleDidSave);
  }

  removeDocument(uri: string) {
    logger.debug(`TextDocuments: removing document ${uri}`);
    const document = this.get(uri);
    this._disposables.remove(document);
    this._documents.delete(uri);
    document.dispose();
  }

  all(): Array<TextDocument> {
    return Array.from(this._documents.values());
  }

  onDidChangeContent(handler: (e: TextDocumentChangeEvent) => mixed): void {
    this._emitter.on('didChangeContent', handler);
  }

  onDidSave(handler: (e: TextDocumentChangeEvent) => mixed): void {
    this._emitter.on('didSave', handler);
  }

  onDidOpen(handler: (e: TextDocumentChangeEvent) => mixed): void {
    this._emitter.on('didOpen', handler);
  }

  _handleDidStopChanging = (document: TextDocument) => {
    this._emitter.emit('didChangeContent', { document });
  };

  _handleDidSave = (document: TextDocument) => {
    this._emitter.emit('didSave', { document });
  };
}
