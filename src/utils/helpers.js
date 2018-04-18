/* @flow */
import {
  type IPosition,
  type ILocation,
  type IRange,
  Location,
  Position,
  Range,
  type DiagnosticSeverityType,
  DiagnosticSeverity,
} from './lsp';

import {
  type GQLPosition,
  type GQLLocation,
  type GQLErrorSeverityType,
} from './gql/types';

import { Point as AtomPoint } from 'simple-text-buffer';
import URI from 'vscode-uri';

export function gqlPositionToLSPPosition(gqlPosition: GQLPosition): IPosition {
  return Position.create(gqlPosition.line - 1, gqlPosition.column - 1);
}

export function lspPositionToGQLPosition(lspPosition: IPosition): GQLPosition {
  return {
    line: lspPosition.line + 1,
    column: lspPosition.character + 1,
  };
}

export function gqlLocationToLSPLocation(gqlLocation: GQLLocation): ILocation {
  return Location.create(
    filePathToURI(gqlLocation.path),
    Range.create(
      gqlPositionToLSPPosition(gqlLocation.start),
      gqlPositionToLSPPosition(gqlLocation.end),
    ),
  );
}

export function filePathToURI(filePath: string): string {
  return URI.file(filePath).toString();
}

export function uriToFilePath(uri: string): string {
  return URI.parse(uri).fsPath;
}

export function lspPositionToAtomPoint(lspPosition: IPosition): AtomPoint {
  return new AtomPoint(lspPosition.line, lspPosition.character);
}

export function atomPointToLSPPosition(atomPoint: AtomPoint): IPosition {
  return Position.create(atomPoint.row, atomPoint.column);
}

export function lspRangeToAtomRange(
  lspRange: IRange,
): { start: AtomPoint, end: AtomPoint } {
  return {
    start: lspPositionToAtomPoint(lspRange.start),
    end: lspPositionToAtomPoint(lspRange.end),
  };
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
