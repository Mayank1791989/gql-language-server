/* @flow strict */
import { type IGQLService } from '../utils/gql/types';
import {
  type ICompletionList,
  type TextDocumentPositionParams,
  CompletionItemKind,
  TextDocuments,
} from 'vscode-languageserver';

import { lspPositionToGQLPosition, uriToFilePath } from '../utils/helpers';

type CompletionParams = {
  documents: TextDocuments,
  gqlService: IGQLService,
};

export default class Completion {
  documents: TextDocuments;
  gqlService: IGQLService;

  constructor({ documents, gqlService }: CompletionParams) {
    this.documents = documents;
    this.gqlService = gqlService;
  }

  provideCompletionItems(params: TextDocumentPositionParams): ICompletionList {
    const doc = this.documents.get(params.textDocument.uri);
    if (!doc) {
      // @TODO: show some warning why document not found
      return { isIncomplete: false, items: [] };
    }

    const items = this.gqlService.autocomplete({
      sourcePath: uriToFilePath(params.textDocument.uri),
      sourceText: doc.getText(),
      position: lspPositionToGQLPosition(params.position),
    });

    return {
      isIncomplete: false,
      items: items.map(({ text, type, description }) => ({
        label: text,
        detail: type || '',
        kind: typeToKind(type),
        documentation: description || '',
      })),
    };
  }
}

function typeToKind(type) {
  switch (type) {
    case 'Scalar':
    case 'Union':
    case 'Input':
    case 'Object':
      return CompletionItemKind.Class;
    case 'Interface':
      return CompletionItemKind.Interface;
    case 'Enum':
      return CompletionItemKind.Enum;
    default:
      return CompletionItemKind.Field;
  }
}
