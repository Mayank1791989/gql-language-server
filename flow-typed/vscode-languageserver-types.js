declare module 'vscode-languageserver-types' {
  /**
   * Position in a text document expressed as zero-based line and character offset.
   */
  declare export interface IPosition {
    /**
     * Line position in a document (zero-based).
     */
    line: number;

    /**
     * Character offset on a line in a document (zero-based). Assuming that the line is
     * represented as a string, the `character` value represents the gap between the
     * `character` and `character + 1`. Given the following line: 'a𐐀c', character 0 is
     * the gap between the start of the start and 'a' ('|a𐐀c'), character 1 is the gap
     * between 'a' and '𐐀' ('a|𐐀c') and character 2 is the gap between '𐐀' and 'b' ('a𐐀|c').
     *
     * The string 'a𐐀c' consist of 3 characters with valid character values being 0, 1, 2, 3
     * for that string. Note that the string encoded in UTF-16 is encoded using 4 code units
     * (the 𐐀 is encoded using two code units). The character offset is therefore encoding
     * independent.
     */
    character: number;
  }

  declare export var Position: {
    /**
     * Creates a new Position literal from the given line and character.
     * @param line The position's line.
     * @param character The position's character.
     */
    create(line: number, character: number): IPosition,
    /**
     * Checks whether the given liternal conforms to the [Position](#Position) interface.
     */
    is(value: any): boolean,
  };

  /**
   * A range in a text document expressed as (zero-based) start and end positions.
   */
  declare export interface IRange {
    /**
     * The range's start position
     */
    start: IPosition;

    /**
     * The range's end position
     */
    end: IPosition;
  }

  declare export var Range: {
    /**
     * Create a new Range liternal.
     * @param start The range's start position.
     * @param end The range's end position.
     */
    create(start: IPosition, end: IPosition): IRange,
    create(
      startLine: number,
      startCharacter: number,
      endLine: number,
      endCharacter: number,
    ): IRange,
    create(
      one: IPosition | number,
      two: IPosition | number,
      three?: number,
      four?: number,
    ): IRange,

    /**
     * Checks whether the given liternal conforms to the [Position](#Position) interface.
     */
    is(value: any): boolean,
  };

  /**
   * Represents a location inside a resource, such as a line
   * inside a text file.
   */
  declare export interface ILocation {
    uri: string;
    range: IRange;
  }

  declare export var Location: {
    /**
     * Creates a Location literal.
     * @param uri The location's uri.
     * @param range The location's range.
     */
    create(uri: string, range: IRange): ILocation,

    /**
     * Checks whether the given literal conforms to the [Location](#Location) interface.
     */
    is(value: any): boolean,
  };

  declare export var DiagnosticSeverity: {
    Error: 1,
    Warning: 2,
    Information: 3,
    Hint: 4,
  };

  declare export type DiagnosticSeverityType = 1 | 2 | 3 | 4;

  /**
   * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
   * are only valid in the scope of a resource.
   */
  declare export interface IDiagnostic {
    /**
     * The range at which the message applies
     */
    range: IRange;

    /**
     * The diagnostic's severity. Can be omitted. If omitted it is up to the
     * client to interpret diagnostics as error, warning, info or hint.
     */
    severity?: DiagnosticSeverityType;

    /**
     * The diagnostic's code. Can be omitted.
     */
    code?: number | string;

    /**
     * A human-readable string describing the source of this
     * diagnostic, e.g. 'typescript' or 'super lint'.
     */
    source?: string;

    /**
     * The diagnostic's message.
     */
    message: string;
  }

  declare export var Diagnostic: {
    /**
     * Creates a new Diagnostic literal.
     */
    create(
      range: IRange,
      message: string,
      severity?: DiagnosticSeverityType,
      code?: number | string,
      source?: string,
    ): IDiagnostic,

    /**
     * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
     */
    is(value: any): boolean,
  };

  /**
   * Represents a reference to a command. Provides a title which
   * will be used to represent a command in the UI and, optionally,
   * an array of arguments which will be passed to the command handler
   * function when invoked.
   */
  declare export interface ICommand {
    /**
     * Title of the command, like `save`.
     */
    title: string;

    /**
     * The identifier of the actual command handler.
     */
    command: string;

    /**
     * Arguments that the command handler should be
     * invoked with.
     */
    arguments?: any[];
  }

  declare export var Command: {
    /**
     * Creates a new Command literal.
     */
    create(title: string, command: string, ...args: Array<any>): ICommand,

    /**
     * Checks whether the given literal conforms to the [Command](#Command) interface.
     */
    is(value: any): boolean,
  };

  /**
   * A text edit applicable to a text document.
   */
  declare export interface ITextEdit {
    /**
     * The range of the text document to be manipulated. To insert
     * text into a document create a range where start === end.
     */
    range: IRange;

    /**
     * The string to be inserted. For delete operations use an
     * empty string.
     */
    newText: string;
  }

  declare export var TextEdit: {
    /**
     * Creates a replace text edit.
     * @param range The range of text to be replaced.
     * @param newText The new text.
     */
    replace(range: IRange, newText: string): ITextEdit,

    /**
     * Creates a insert text edit.
     * @param psotion The position to insert the text at.
     * @param newText The text to be inserted.
     */
    insert(position: IPosition, newText: string): ITextEdit,

    /**
     * Creates a delete text edit.
     * @param range The range of text to be deleted.
     */
    del(range: IRange): ITextEdit,
  };

  /**
   * An identifier to denote a specific version of a text document.
   */
  declare export type IVersionedTextDocumentIdentifier = {
    /**
     * The version number of this document.
     */
    version: number,
  } & ITextDocumentIdentifier;

  declare export var VersionedTextDocumentIdentifier: {
    /**
     * Creates a new VersionedTextDocumentIdentifier literal.
     * @param uri The document's uri.
     * @param uri The document's text.
     */
    create(uri: string, version: number): IVersionedTextDocumentIdentifier,

    /**
     * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
     */
    is(value: any): boolean,
  };

  /**
   * Describes textual changes on a text document.
   */
  declare export interface ITextDocumentEdit {
    /**
     * The text document to change.
     */
    textDocument: IVersionedTextDocumentIdentifier;

    /**
     * The edits to be applied.
     */
    edits: Array<ITextEdit>;
  }

  declare export var TextDocumentEdit: {
    /**
     * Creates a new `TextDocumentEdit`
     */
    create(
      textDocument: IVersionedTextDocumentIdentifier,
      edits: Array<ITextEdit>,
    ): ITextDocumentEdit,

    is(value: any): boolean,
  };

  /**
   * A workspace edit represents changes to many resources managed in the workspace. The edit
   * should either provide `changes` or `documentChanges`. If documentChanges are present
   * they are preferred over `changes` if the client can handle versioned document edits.
   */
  declare export interface WorkspaceEdit {
    /**
     * Holds changes to existing resources.
     */
    changes?: {
      [uri: string]: Array<ITextEdit>,
    };

    /**
     * An array of `TextDocumentEdit`s to express changes to specific a specific
     * version of a text document. Whether a client supports versioned document
     * edits is expressed via `WorkspaceClientCapabilites.versionedWorkspaceEdit`.
     */
    documentChanges?: Array<ITextDocumentEdit>;
  }

  /**
   * A change to capture text edits for existing resources.
   */
  declare export interface TextEditChange {
    /**
     * Gets all text edits for this change.
     * @return  An array of text edits.
     */
    all(): Array<ITextEdit>;

    /**
     * Clears the edits for this change.
     */
    clear(): void;

    /**
     * Adds a text edit.
     * @param edit the text edit to add.
     */
    add(edit: ITextEdit): void;

    /**
     * Insert the given text at the given position.
     * @param position A position.
     * @param newText A string.
     */
    insert(position: IPosition, newText: string): void;

    /**
     * Replace the given range with given text for the given resource.
     * @param range A range.
     * @param newText A string.
     */
    replace(range: IRange, newText: string): void;

    /**
     * Delete the text at the given range.
     * @param range A range.
     */
    delete(range: IRange): void;
  }

  /**
   * A workspace change helps constructing changes to a workspace.
   */
  declare export class WorkspaceChange {
    constructor(workspaceEdit?: WorkspaceEdit): this;

    /**
     * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
     * use to be returned from a workspace edit operation like rename.
     */
    edit: WorkspaceEdit;

    /**
     * Returns the [TextEditChange](#TextEditChange) to manage text edits
     * for resources.
     */
    getTextEditChange(
      textDocument: IVersionedTextDocumentIdentifier,
    ): TextEditChange;
    getTextEditChange(uri: string): TextEditChange;
  }

  /**
   * A literal to identify a text document in the client.
   */
  declare export interface ITextDocumentIdentifier {
    /**
     * The text document's uri.
     */
    uri: string;
  }

  declare export var TextDocumentIdentifier: {
    /**
     * Creates a new TextDocumentIdentifier literal.
     * @param uri The document's uri.
     */
    create(uri: string): ITextDocumentIdentifier,

    /**
     * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
     */
    is(value: any): boolean,
  };

  /**
   * An item to transfer a text document from the client to the
   * server.
   */
  declare export interface ITextDocumentItem {
    /**
     * The text document's uri.
     */
    uri: string;

    /**
     * The text document's language identifier
     */
    languageId: string;

    /**
     * The version number of this document (it will strictly increase after each
     * change, including undo/redo).
     */
    version: number;

    /**
     * The content of the opened text document.
     */
    text: string;
  }

  declare export var TextDocumentItem: {
    /**
     * Creates a new TextDocumentItem literal.
     * @param uri The document's uri.
     * @param uri The document's language identifier.
     * @param uri The document's version number.
     * @param uri The document's text.
     */
    create(
      uri: string,
      languageId: string,
      version: number,
      text: string,
    ): ITextDocumentItem,

    /**
     * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
     */
    is(value: any): boolean,
  };

  declare export var CompletionItemKind: {
    Text: 1,
    Method: 2,
    Function: 3,
    Constructor: 4,
    Field: 5,
    Variable: 6,
    Class: 7,
    Interface: 8,
    Module: 9,
    Property: 10,
    Unit: 11,
    Value: 12,
    Enum: 13,
    Keyword: 14,
    Snippet: 15,
    Color: 16,
    File: 17,
    Reference: 18,
  };

  declare export type CompletionItemKindType =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18;

  declare export var InsertTextFormat: {
    PlainText: 1,
    Snippet: 2,
  };

  declare export type InsertTextFormatType = 1 | 2;

  /**
   * A completion item represents a text snippet that is
   * proposed to complete text that is being typed.
   */
  declare export interface ICompletionItem {
    /**
     * The label of this completion item. By default
     * also the text that is inserted when selecting
     * this completion.
     */
    label: string;

    /**
     * The kind of this completion item. Based of the kind
     * an icon is chosen by the editor.
     */
    kind?: CompletionItemKindType;

    /**
     * A human-readable string with additional information
     * about this item, like type or symbol information.
     */
    detail?: string;

    /**
     * A human-readable string that represents a doc-comment.
     */
    documentation?: string;

    /**
     * A string that shoud be used when comparing this item
     * with other items. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    sortText?: string;

    /**
     * A string that should be used when filtering a set of
     * completion items. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    filterText?: string;

    /**
     * A string that should be inserted a document when selecting
     * this completion. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    insertText?: string;

    /**
     * The format of the insert text. The format applies to both the `insertText` property
     * and the `newText` property of a provided `textEdit`.
     */
    insertTextFormat?: InsertTextFormatType;

    /**
     * An [edit](#TextEdit) which is applied to a document when selecting
     * this completion. When an edit is provided the value of
     * [insertText](#CompletionItem.insertText) and [range](#CompletionItem.range) is ignored.
     */
    textEdit?: ITextEdit;

    /**
     * An optional array of additional [text edits](#TextEdit) that are applied when
     * selecting this completion. Edits must not overlap with the main [edit](#CompletionItem.textEdit)
     * nor with themselves.
     */
    additionalTextEdits?: ITextEdit[];

    /**
     * An optional [command](#Command) that is executed after inserting this completion. Note that
     * additional modifications to the current document should be described with the
     * [additionalTextEdits](#CompletionItem.additionalTextEdits)-property.
     */
    command?: ICommand;

    /**
     * An data entry field that is preserved on a completion item between
     * a [CompletionRequest](#CompletionRequest) and a [CompletionResolveRequest]
     *(#CompletionResolveRequest)
     */
    data?: any;
  }

  declare export var CompletionItem: {
    /**
     * The CompletionItem namespace provides functions to deal with
     * completion items.
     */
    create(label: string): ICompletionItem,
  };

  /**
   * Represents a collection of [completion items](#CompletionItem) to be presented
   * in the editor.
   */
  declare export type ICompletionList = {
    /**
     * This list it not complete. Further typing results in recomputing this list.
     */
    isIncomplete: boolean,

    /**
     * The completion items.
     */
    items: ICompletionItem[],
  };

  declare export var CompletionList: {
    /**
     * Creates a new completion list.
     *
     * @param items The completion items.
     * @param isIncomplete The list is not complete.
     */
    create(
      items?: Array<ICompletionItem>,
      isIncomplete?: boolean,
    ): ICompletionList,
  };

  /**
   * MarkedString can be used to render human readable text. It is either a markdown string
   * or a code-block that provides a language and a code snippet. The language identifier
   * is sematically equal to the optional language identifier in fenced code blocks in GitHub
   * issues. See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting
   *
   * The pair of a language and a value is an equivalent to markdown:
    ```${language}
    ${value}
    ```
   *
   * Note that markdown strings will be sanitized - that means html will be escaped.
  */
  declare export type IMarkedString =
    | string
    | {
        language: string,
        value: string,
      };

  declare export var MarkedString: {
    /**
     * Creates a marked string from plain text.
     * @param plainText The plain text.
     */
    fromPlainText(plainText: string): IMarkedString,
  };

  /**
   * The result of a hover request.
   */
  declare export type IHover = {
    /**
     * The hover's content
     */
    contents: IMarkedString | IMarkedString[],

    /**
     * An optional range
     */
    range?: IRange,
  };

  /**
   * Represents a parameter of a callable-signature. A parameter can
   * have a label and a doc-comment.
   */
  declare interface IParameterInformation {
    /**
     * The label of this signature. Will be shown in
     * the UI.
     */
    label: string;

    /**
     * The human-readable doc-comment of this signature. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string;
  }

  declare export var ParameterInformation: {
    /**
     * Creates a new parameter information literal.
     *
     * @param label A label string.
     * @param documentation A doc string.
     */
    create(label: string, documentation?: string): IParameterInformation,
  };

  /**
   * Represents the signature of something callable. A signature
   * can have a label, like a function-name, a doc-comment, and
   * a set of parameters.
   */
  declare export interface ISignatureInformation {
    /**
     * The label of this signature. Will be shown in
     * the UI.
     */
    label: string;

    /**
     * The human-readable doc-comment of this signature. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string;

    /**
     * The parameters of this signature.
     */
    parameters?: IParameterInformation[];
  }

  declare var SignatureInformation: {
    /**
     * Creates a new Position literal from the given line and character.
     * @param line The position's line.
     * @param character The position's character.
     */
    create(
      label: string,
      documentation?: string,
      ...parameters: Array<IParameterInformation>
    ): ISignatureInformation,
  };

  /**
   * Signature help represents the signature of something
   * callable. There can be multiple signature but only one
   * active and only one active parameter.
   */
  declare export interface ISignatureHelp {
    /**
     * One or more signatures.
     */
    signatures: Array<ISignatureInformation>;

    /**
     * The active signature.
     */
    activeSignature: number;

    /**
     * The active parameter of the active signature.
     */
    activeParameter: number;
  }

  /**
   * The definition of a symbol represented as one or many [locations](#Location).
   * For most programming languages there is only one location at which a symbol is
   * defined.
   */
  declare export type IDefinition = null | ILocation | ILocation[];

  /**
   * Value-object that contains additional information when
   * requesting references.
   */
  declare export interface ReferenceContext {
    /**
     * Include the declaration of the current symbol.
     */
    includeDeclaration: boolean;
  }

  declare export var DocumentHighlightKind: {
    Text: 1,
    Read: 2,
    Write: 3,
  };

  declare export type DocumentHighlightKindType = 1 | 2 | 3;
  /**
   * A document highlight is a range inside a text document which deserves
   * special attention. Usually a document highlight is visualized by changing
   * the background color of its range.
   */
  declare export interface IDocumentHighlight {
    /**
     * The range this highlight applies to.
     */
    range: IRange;

    /**
     * The highlight kind, default is [text](#DocumentHighlightKind.Text).
     */
    kind?: DocumentHighlightKindType;
  }

  declare export var DocumentHighlight: {
    /**
     * Create a DocumentHighlight object.
     * @param range The range the highlight applies to.
     */
    create(range: IRange, kind?: DocumentHighlightKindType): IDocumentHighlight,
  };

  declare export var SymbolKind: {
    File: 1,
    Module: 2,
    Namespace: 3,
    Package: 4,
    Class: 5,
    Method: 6,
    Property: 7,
    Field: 8,
    Constructor: 9,
    Enum: 10,
    Interface: 11,
    Function: 12,
    Variable: 13,
    Constant: 14,
    String: 15,
    Number: 16,
    Boolean: 17,
    Array: 18,
  };

  declare export type SymbolKindType =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18;

  /**
   * Represents information about programming constructs like variables, classes,
   * interfaces etc.
   */
  declare export interface ISymbolInformation {
    /**
     * The name of this symbol.
     */
    name: string;

    /**
     * The kind of this symbol.
     */
    kind: SymbolKindType;

    /**
     * The location of this symbol.
     */
    location: ILocation;

    /**
     * The name of the symbol containing this symbol.
     */
    containerName?: string;
  }

  declare export var SymbolInformation: {
    /**
     * Creates a new symbol information literal.
     *
     * @param name The name of the symbol.
     * @param kind The kind of the symbol.
     * @param range The range of the location of the symbol.
     * @param uri The resource of the location of symbol, defaults to the current document.
     * @param containerName The name of the symbol containg the symbol.
     */
    create(
      name: string,
      kind: SymbolKindType,
      range: IRange,
      uri?: string,
      containerName?: string,
    ): ISymbolInformation,
  };

  /**
   * Parameters for a [DocumentSymbolRequest](#DocumentSymbolRequest).
   */
  declare export interface DocumentSymbolParams {
    /**
     * The text document.
     */
    textDocument: ITextDocumentIdentifier;
  }

  /**
   * The parameters of a [WorkspaceSymbolRequest](#WorkspaceSymbolRequest).
   */
  declare export interface WorkspaceSymbolParams {
    /**
     * A non-empty query string
     */
    query: string;
  }

  /**
   * Contains additional diagnostic information about the context in which
   * a [code action](#CodeActionProvider.provideCodeActions) is run.
   */
  declare export interface ICodeActionContext {
    /**
     * An array of diagnostics.
     */
    diagnostics: IDiagnostic[];
  }

  declare export var CodeActionContext: {
    /**
     * Creates a new CodeActionContext literal.
     */
    create(diagnostics: Array<IDiagnostic>): ICodeActionContext,

    /**
     * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
     */
    is(value: any): boolean,
  };

  /**
   * A code lens represents a [command](#Command) that should be shown along with
   * source text, like the number of references, a way to run tests, etc.
   *
   * A code lens is _unresolved_ when no command is associated to it. For performance
   * reasons the creation of a code lens and resolving should be done to two stages.
   */
  declare export interface ICodeLens {
    /**
     * The range in which this code lens is valid. Should only span a single line.
     */
    range: IRange;

    /**
     * The command this code lens represents.
     */
    command?: ICommand;

    /**
     * An data entry field that is preserved on a code lens item between
     * a [CodeLensRequest](#CodeLensRequest) and a [CodeLensResolveRequest]
     * (#CodeLensResolveRequest)
     */
    data?: any;
  }

  declare var CodeLens: {
    /**
     * Creates a new CodeLens literal.
     */
    create(range: IRange, data?: any): ICodeLens,

    /**
     * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
     */
    is(value: any): boolean,
  };

  /**
   * Value-object describing what options formatting should use.
   */
  declare export interface IFormattingOptions {
    [key: string]: boolean | number | string;
    /**
     * Size of a tab in spaces.
     */
    tabSize: number;

    /**
     * Prefer spaces over tabs.
     */
    insertSpaces: boolean;
  }

  declare export var FormattingOptions: {
    /**
     * Creates a new FormattingOptions literal.
     */
    create(tabSize: number, insertSpaces: boolean): IFormattingOptions,

    /**
     * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
     */
    is(value: any): boolean,
  };

  /**
   * A document link is a range in a text document that links to an internal or external resource, like another
   * text document or a web site.
   */
  declare export class DocumentLink {
    /**
     * Creates a new DocumentLink literal.
     */
    static create(range: IRange, target?: string): DocumentLink;

    /**
     * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
     */
    static is(value: any): boolean;

    /**
     * The range this link applies to.
     */
    range: IRange;

    /**
     * The uri this link points to.
     */
    target: string;
  }

  declare export var EOL: ['\n', '\r\n', '\r'];

  /**
   * A simple text document. Not to be implemenented.
   */
  declare export interface ITextDocument {
    /**
     * The associated URI for this document. Most documents have the __file__-scheme, indicating that they
     * represent files on disk. However, some documents may have other schemes indicating that they are not
     * available on disk.
     * @readonly
     */
    uri: string;

    /**
     * The identifier of the language associated with this document.
     * @readonly
     */
    languageId: string;

    /**
     * The version number of this document (it will strictly increase after each
     * change, including undo/redo).
     * @readonly
     */
    version: number;

    /**
     * Get the text of this document.
     * @return  The text of this document.
     */
    getText(): string;

    /**
     * Converts a zero-based offset to a position.
     * @param offset A zero-based offset.
     * @return  A valid [position](#Position).
     */
    positionAt(offset: number): IPosition;

    /**
     * Converts the position to a zero-based offset.
     *
     * The position will be [adjusted](#TextDocument.validatePosition).
     * @param position A position.
     * @return  A valid zero-based offset.
     */
    offsetAt(position: IPosition): number;

    /**
     * The number of lines in this document.
     * @readonly
     */
    lineCount: number;
  }

  declare export var TextDocument: {
    /**
     * Creates a new ITextDocument literal from the given uri and content.
     * @param uri The document's uri.
     * @param languageId  The document's language Id.
     * @param content The document's content.
     */
    create(
      uri: string,
      languageId: string,
      version: number,
      content: string,
    ): ITextDocument,

    /**
     * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
     */
    is(value: any): boolean,
  };

  /**
   * An event describing a change to a text document. If range and rangeLength are omitted
   * the new text is considered to be the full content of the document.
   */
  declare export interface TextDocumentContentChangeEvent {
    /**
     * The range of the document that changed.
     */
    range?: IRange;

    /**
     * The length of the range that got replaced.
     */
    rangeLength?: number;

    /**
     * The new text of the document.
     */
    text: string;
  }

  /**
   * Event to signal changes to a simple text document.
   */
  declare export interface TextDocumentChangeEvent {
    /**
     * The document that has changed.
     */
    document: ITextDocument;
  }

  declare export var TextDocumentSaveReason: {
    Manual: 1,
    AfterDelay: 2,
    FocusOut: 3,
  };
  declare export type TextDocumentSaveReasonType = 1 | 2 | 3;

  declare export interface TextDocumentWillSaveEvent {
    /**
     * The document that will be saved
     */
    document: ITextDocument;

    /**
     * The reason why save was triggered.
     */
    reason: TextDocumentSaveReasonType;
  }
}
