/* @flow strict */
import { type IGQLService } from '../utils/gql';
import {
  type TextDocumentPositionParams,
  type ILocation,
  TextDocuments,
} from 'vscode-languageserver';
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

  provideDefinition(params: TextDocumentPositionParams): Array<ILocation> {
    const doc = this.documents.get(params.textDocument.uri);
    if (!doc) {
      return [];
    }

    const defLocation = this.gqlService.getDef({
      sourceText: doc.getText(),
      sourcePath: uriToFilePath(params.textDocument.uri),
      position: lspPositionToGQLPosition(params.position),
    });

    return defLocation.map(gqlLocationToLSPLocation);
  }
}
