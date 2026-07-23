import type { ExpressionReference, HostResolvedImport, ResolvedModuleId, SourceSpan, SymbolDefinition } from './contracts';
import type { BailoutReason } from './diagnostics';
export type ElementForm = 'jsx' | 'jsx-runtime' | 'create-element';
export type StaticValue = string | number | boolean | null;
export type ElementValue = {
    kind: 'static';
    value: StaticValue;
    span: SourceSpan;
} | ExpressionReference;
export interface ComponentImportProvenance {
    specifier: string;
    importedName: string;
    resolvedId: ResolvedModuleId;
    external: boolean;
}
export interface ElementComponentIR {
    kind: 'binding' | 'intrinsic';
    name: string;
    span: SourceSpan;
    closingSpan: SourceSpan | null;
    definition: SymbolDefinition | null;
    provenance: ComponentImportProvenance | null;
}
export interface ElementPropIR {
    kind: 'prop';
    name: string;
    span: SourceSpan;
    value: ElementValue;
}
export interface ElementSpreadIR {
    kind: 'spread';
    span: SourceSpan;
    value: ExpressionReference;
}
export interface ElementChildIR {
    kind: 'child';
    span: SourceSpan;
    value: ElementValue | {
        kind: 'element';
        span: SourceSpan;
    } | {
        kind: 'empty';
        span: SourceSpan;
    };
}
/**
 * Entries remain in source order. Consumers must apply duplicate props in this order;
 * the last statically evaluated value wins exactly as it does at runtime.
 */
export type ElementEntryIR = ElementPropIR | ElementSpreadIR | ElementChildIR;
export interface ElementIRBase {
    kind: 'element';
    form: ElementForm;
    id: ResolvedModuleId;
    span: SourceSpan;
    /** JSX opening element or compiled props argument, used for punctuation-safe edits. */
    propsSpan: SourceSpan | null;
    component: ElementComponentIR;
}
export interface CompleteElementIR extends ElementIRBase {
    complete: true;
    entries: ElementEntryIR[];
    bailouts: readonly [];
}
export interface IncompleteElementIR extends ElementIRBase {
    complete: false;
    /** Preserved only for diagnostics; incomplete entries must never be optimized. */
    bailedEntries: ElementEntryIR[];
    bailouts: readonly [BailoutReason, ...BailoutReason[]];
}
export type ElementIR = CompleteElementIR | IncompleteElementIR;
export interface StyledDefinitionIRBase {
    kind: 'styled-definition';
    id: ResolvedModuleId;
    name: string;
    span: SourceSpan;
    definitionSpan: SourceSpan;
    factory: ComponentImportProvenance;
    base: ElementComponentIR;
    baseClassName: ElementValue | null;
    options: ExpressionReference;
}
export interface CompleteStyledDefinitionIR extends StyledDefinitionIRBase {
    complete: true;
    bailouts: readonly [];
}
export interface IncompleteStyledDefinitionIR extends StyledDefinitionIRBase {
    complete: false;
    bailouts: readonly [BailoutReason, ...BailoutReason[]];
}
export type StyledDefinitionIR = CompleteStyledDefinitionIR | IncompleteStyledDefinitionIR;
export interface ElementIRResult {
    elements: ElementIR[];
    styledDefinitions: StyledDefinitionIR[];
    bailouts: BailoutReason[];
}
export declare function hostImportProvenance(imports: readonly HostResolvedImport[], specifier: string, importedName: string): ComponentImportProvenance | null;
//# sourceMappingURL=ir.d.ts.map