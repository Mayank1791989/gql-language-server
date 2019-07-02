/* @flow strict */
import { type IGQLService } from '../utils/gql';
import {
  type IHover,
  type TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver';
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
    const doc = this.documents.get(params.textDocument.uri);
    if (!doc) {
      // TODO: show warning
      return { contents: [] };
    }

    const info = this.gqlService.getInfo({
      sourceText: doc.getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    const result = {
      contents: [],
    };

    info.forEach((item) => {
      item.contents.forEach((content) => {
        result.contents.push({
          language: 'graphql',
          value: content,
        });
      });
    });

    return result;
  }
}
