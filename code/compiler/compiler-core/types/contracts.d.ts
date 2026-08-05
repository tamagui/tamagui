export interface AstNode {
    type: string;
    start: number;
    end: number;
    [key: string]: unknown;
}
export type ResolvedModuleId = string & {
    readonly __resolvedModuleId: unique symbol;
};
export interface SourceSpan {
    id: ResolvedModuleId;
    /** UTF-16 source-string index, inclusive. */
    start: number;
    /** UTF-16 source-string index, exclusive. */
    end: number;
}
export interface HostResolvedImport {
    specifier: string;
    resolvedId: ResolvedModuleId;
    external?: boolean;
}
export interface HostModuleInput {
    id: ResolvedModuleId;
    source: string;
    /** Every import identity is canonical and resolved before the compiler sees it. */
    imports: readonly HostResolvedImport[];
}
export interface HostResolvedProject {
    modules: readonly HostModuleInput[];
}
export interface ProjectInput {
    files: ReadonlyMap<string, string>;
    resolutions: ReadonlyMap<string, string>;
}
export interface DefinitionSite {
    id: ResolvedModuleId;
    name: string;
    start: number;
    end: number;
    initializer: AstNode | null;
    constant: boolean;
}
export interface ReferenceSite {
    id: ResolvedModuleId;
    name: string;
    start: number;
    end: number;
}
export interface ParseDiagnostic {
    kind: 'parse' | 'link';
    id: ResolvedModuleId;
    message: string;
}
export interface AnalyzerCandidate {
    readonly name: string;
    addFile(id: string, source: string): void;
    removeFile(id: string): boolean;
    link(): void;
    definitionOf(id: string, localName: string): DefinitionSite | null;
    referencesOf(definition: DefinitionSite): ReferenceSite[];
    dependenciesOf(id: string): string[];
    dependentsOf(id: string): string[];
    affectedBy(id: string): string[];
    programOf(id: string): AstNode;
    sourceOf(id: string): string;
    parseCount(id: string): number;
    diagnostics(): ParseDiagnostic[];
}
export interface ExpressionReference extends SourceSpan {
    readonly kind: 'expression';
}
export interface SymbolDefinition {
    id: ResolvedModuleId;
    name: string;
    span: SourceSpan;
    initializer: ExpressionReference | null;
    constant: boolean;
}
/** Parser-independent symbol access used by partial evaluation and element IR. */
export interface SymbolResolver {
    resolveBinding(id: ResolvedModuleId, localName: string): SymbolDefinition | null;
    expressionNode(reference: ExpressionReference): AstNode | null;
    sourceOf(id: ResolvedModuleId): string;
}
export interface CandidateFactory {
    name: AnalyzerCandidate['name'];
    create(project: ProjectInput): AnalyzerCandidate;
    /** Parser-owned static module scan; no parser-specific node types escape this boundary. */
    scanImports(id: ResolvedModuleId, source: string): string[];
}
export declare function resolutionKey(importer: string, specifier: string): string;
export declare function resolveFromHost(resolutions: ReadonlyMap<string, string>, specifier: string, importer: string): string | null;
export declare function resolvedModuleId(id: string): ResolvedModuleId;
export declare function expressionReference(id: ResolvedModuleId, node: Pick<AstNode, 'start' | 'end'>): ExpressionReference;
export declare function spanOf(id: ResolvedModuleId, node: Pick<AstNode, 'start' | 'end'>): SourceSpan;
export declare function textOfSpan(source: string, span: Pick<SourceSpan, 'start' | 'end'>): string;
//# sourceMappingURL=contracts.d.ts.map