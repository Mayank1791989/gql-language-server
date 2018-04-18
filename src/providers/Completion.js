/* @flow */
import { type IGQLService } from '../utils/gql/types';
import {
  type ICompletionList,
  type TextDocumentPositionParams,
  CompletionItemKind,
} from '../utils/lsp';

import TextDocuments from '../utils/TextDocuments';
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
    const items = this.gqlService.autocomplete({
      sourcePath: uriToFilePath(params.textDocument.uri),
      sourceText: this.documents.get(params.textDocument.uri).getText(),
      position: lspPositionToGQLPosition(params.position),
    });

    return {
      isIncomplete: false,
      items: items.map(({ text, type, description }) => ({
        label: text,
        detail: type || '',
        kind: CompletionItemKind.Interface,
        documentation: description || '',
      })),
    };
  }
}
