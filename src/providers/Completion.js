/* @flow */
import { type IGQLService } from '../utils/gql/types';
import {
  CompletionItemKind,
  type ICompletionList,
  type TextDocumentPositionParams,
  type CompletionItemKindType,
} from '../utils/lsp';

import TextDocuments from '../utils/TextDocuments';
import { lspPositionToGQLPosition, uriToFilePath } from '../utils/helpers';

type CompletionParams = {
  documents: TextDocuments,
  gqlService: IGQLService,
};

const COMPLETION_ITEM_KIND_LOOKUP: {
  [string]: CompletionItemKindType,
} = {
  // query
  Document: CompletionItemKind.File,
  SelectionSet: CompletionItemKind.Field,
  Field: CompletionItemKind.Field,
  AliasedField: CompletionItemKind.Field,
  Arguments: CompletionItemKind.Variable,
  Argument: CompletionItemKind.Variable,
  ObjectValue: CompletionItemKind.Property,
  ObjectField: CompletionItemKind.Property,
  EnumValue: CompletionItemKind.Enum,
  ListValue: CompletionItemKind.Enum,
  TypeCondition: CompletionItemKind.Keyword,
  FragmentSpread: CompletionItemKind.Interface,
  ListType: CompletionItemKind.Variable,
  Directive: CompletionItemKind.Method,
  // schema
  UnionDef: CompletionItemKind.Class,
  FieldDef: CompletionItemKind.Field,
  ObjectTypeDef: CompletionItemKind.Keyword,
  Implements: CompletionItemKind.Interface,
  InputValueDef: CompletionItemKind.Value,
};

function getCompletionItemKind(kind?: string): CompletionItemKindType {
  // eslint-disable-next-line no-undefined
  if (kind !== undefined && COMPLETION_ITEM_KIND_LOOKUP[kind] !== undefined) {
    return COMPLETION_ITEM_KIND_LOOKUP[kind];
  }
  return CompletionItemKind.Text;
}

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
      items: items.map(({ text, type, kind, description }) => ({
        label: text,
        detail: type || '',
        kind: getCompletionItemKind(kind),
        documentation: description || '',
      })),
    };
  }
}
