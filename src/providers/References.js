/* @flow strict */
import {
  type TextDocumentPositionParams,
  type ILocation,
  TextDocuments,
} from 'vscode-languageserver';
import { type IGQLService } from '../utils/gql';
import {
  lspPositionToGQLPosition,
  uriToFilePath,
  gqlLocationToLSPLocation,
} from '../utils/helpers';

type ReferencesParams = {
  documents: TextDocuments,
  gqlService: IGQLService,
};

export default class References {
  documents: TextDocuments;
  gqlService: IGQLService;

  constructor({ documents, gqlService }: ReferencesParams) {
    this.documents = documents;
    this.gqlService = gqlService;
  }

  provideReferences(params: TextDocumentPositionParams): Array<ILocation> {
    const doc = this.documents.get(params.textDocument.uri);
    if (!doc) {
      // TODO: show warning
      return [];
    }

    const refs = this.gqlService.findRefs({
      sourceText: doc.getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    return refs.map(gqlLocationToLSPLocation);
  }
}
