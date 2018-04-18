/* @flow */
import TextDocuments from '../utils/TextDocuments';
import { type TextDocumentPositionParams, type ILocation } from '../utils/lsp';
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
    const refs = this.gqlService.findRefs({
      sourceText: this.documents.get(params.textDocument.uri).getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    return refs.map(gqlLocationToLSPLocation);
  }
}
