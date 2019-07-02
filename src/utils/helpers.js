/* @flow strict */
import {
  type IPosition,
  type ILocation,
  type IRange,
  type DiagnosticSeverityType,
  DiagnosticSeverity,
} from 'vscode-languageserver';

import {
  type GQLPosition,
  type GQLLocation,
  type GQLErrorSeverityType,
} from './gql/types';

import { URI } from 'vscode-uri';

export function gqlPositionToLSPPosition(gqlPosition: GQLPosition): IPosition {
  return {
    line: gqlPosition.line - 1,
    character: gqlPosition.column - 1,
  };
}

export function lspPositionToGQLPosition(lspPosition: IPosition): GQLPosition {
  return {
    line: lspPosition.line + 1,
    column: lspPosition.character + 1,
  };
}

export function gqlLocationToLSPLocation(gqlLocation: GQLLocation): ILocation {
  return {
    uri: filePathToURI(gqlLocation.path),
    range: {
      start: gqlPositionToLSPPosition(gqlLocation.start),
      end: gqlPositionToLSPPosition(gqlLocation.end),
    },
  };
}

export function filePathToURI(filePath: string): string {
  return URI.file(filePath).toString();
}

export function uriToFilePath(uri: string): string {
  return URI.parse(uri).fsPath;
}

export function compareLspPosition(a: IPosition, b: IPosition): number {
  return a.line - b.line || a.character - b.character;
}

export function compareLspRange(a: IRange, b: IRange): number {
  return (
    compareLspPosition(a.start, b.start) || compareLspPosition(a.end, b.end)
  );
}

export function gqlErrorSeverityToDiagnosticSeverity(
  severity: GQLErrorSeverityType,
): DiagnosticSeverityType {
  switch (severity) {
    case 'error':
      return DiagnosticSeverity.Error;
    case 'warn':
      return DiagnosticSeverity.Warning;
    default:
      return DiagnosticSeverity.Hint;
  }
}
