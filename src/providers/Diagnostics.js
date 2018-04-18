/* @flow */
import Emitter from '../utils/Emitter';
import {
  gqlPositionToLSPPosition,
  filePathToURI,
  gqlErrorSeverityToDiagnosticSeverity,
} from '../utils/helpers';
import {
  type GQLPosition,
  type GQLError,
  type IGQLService,
} from '../utils/gql/types';
import {
  type PublishDiagnosticsParams,
  type IDiagnostic,
  Range,
  Diagnostic,
} from '../utils/lsp';

type DiagnosticsParams = {
  gqlService: IGQLService,
};

export default class Diagnostics {
  gqlService: IGQLService;
  _emitter: Emitter = new Emitter();

  // stores latest diagnostic items
  diagnostics: Array<{
    file: string,
    params: PublishDiagnosticsParams,
  }> = [];

  constructor({ gqlService }: DiagnosticsParams) {
    this.gqlService = gqlService;
    this.gqlService.onChange(this._updateDiagnostics);
    process.nextTick(() => this._updateDiagnostics());
  }

  _updateDiagnostics = () => {
    const errors = this.gqlService.status();
    const SCHEMA_FILE = '__schema__';

    const diagnosticsMap: { [file: string]: PublishDiagnosticsParams } = {};
    const diagnostics = [];

    errors.forEach(error => {
      const { locations } = error;
      if (!locations) {
        // global error will be grouped under __schema__
        if (!diagnosticsMap[SCHEMA_FILE]) {
          diagnosticsMap[SCHEMA_FILE] = {
            uri: SCHEMA_FILE,
            diagnostics: [],
          };
        }
        diagnosticsMap[SCHEMA_FILE].diagnostics.push(
          makeLSPDiagnostic(error, { line: 1, column: 1 }),
        );
      } else {
        locations.forEach(loc => {
          if (!diagnosticsMap[loc.path]) {
            diagnosticsMap[loc.path] = {
              uri: filePathToURI(loc.path),
              diagnostics: [],
            };
          }
          diagnosticsMap[loc.path].diagnostics.push(
            makeLSPDiagnostic(error, loc),
          );
        });
      }
    });

    // report new errors
    const diagnosticItems = [];
    Object.keys(diagnosticsMap).forEach(file => {
      diagnostics.push({ file, params: diagnosticsMap[file] });
      diagnosticItems.push(diagnosticsMap[file]);
    });

    // clear old errors
    const clearDiagnosticItems: Array<PublishDiagnosticsParams> = [];
    this.diagnostics.forEach(({ file, params }) => {
      if (diagnosticsMap[file]) {
        return;
      }
      clearDiagnosticItems.push({ uri: params.uri, diagnostics: [] });
    });

    this.diagnostics = diagnostics;

    this._emitter.emit('update', [...diagnosticItems, ...clearDiagnosticItems]);
  };

  listen(listener: (diagnosticItems: Array<PublishDiagnosticsParams>) => void) {
    return this._emitter.on('update', listener);
  }
}

export function makeLSPDiagnostic(
  error: GQLError,
  position: GQLPosition,
): IDiagnostic {
  const startPosition = gqlPositionToLSPPosition(position);

  return Diagnostic.create(
    Range.create(startPosition, startPosition),
    error.message,
    gqlErrorSeverityToDiagnosticSeverity(error.severity),
    'syntax',
    'graphql',
  );
}
