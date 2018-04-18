/* @flow */
import TextDocuments from '../utils/TextDocuments';
import { type IGQLService } from '../utils/gql';
import { type IHover, type TextDocumentPositionParams } from '../utils/lsp';
import { uriToFilePath, lspPositionToGQLPosition } from '../utils/helpers';

type HoverParams = {
  documents: TextDocuments,
  gqlService: IGQLService,
};

export default class Hover {
  documents: TextDocuments;
  gqlService: IGQLService;

  constructor({ documents, gqlService }: HoverParams) {
    this.documents = documents;
    this.gqlService = gqlService;
  }

  provideHover(params: TextDocumentPositionParams): IHover {
    const info = this.gqlService.getInfo({
      sourceText: this.documents.get(params.textDocument.uri).getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    if (info) {
      return {
        contents: info.contents.map(content => ({
          language: 'graphql',
          value: content,
        })),
      };
    }

    return {
      contents: [],
    };
  }
}
