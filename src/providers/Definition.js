/* @flow */
import TextDocuments from '../utils//TextDocuments';
import { type IGQLService } from '../utils/gql';
import { type TextDocumentPositionParams, type ILocation } from '../utils/lsp';
import {
  uriToFilePath,
  lspPositionToGQLPosition,
  gqlLocationToLSPLocation,
} from '../utils/helpers';

type DefinitionParams = {
  documents: TextDocuments,
  gqlService: IGQLService,
};

export default class Definition {
  documents: TextDocuments;
  gqlService: IGQLService;

  constructor({ documents, gqlService }: DefinitionParams) {
    this.documents = documents;
    this.gqlService = gqlService;
  }

  provideDefinition(params: TextDocumentPositionParams): null | ILocation {
    const defLocation = this.gqlService.getDef({
      sourceText: this.documents.get(params.textDocument.uri).getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    if (defLocation) {
      return gqlLocationToLSPLocation(defLocation);
    }

    return null;
  }
}
