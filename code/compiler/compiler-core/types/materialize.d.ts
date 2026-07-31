import type { ResolvedModuleId, SourceSpan } from './contracts';
import type { BailoutReason } from './diagnostics';
import type { StaticEvaluationValue } from './evaluate';
import type { ProjectGraph } from './graph';
import type { ComponentImportProvenance, ElementComponentIR, ElementIR } from './ir';
export type MaterializedValue = {
    kind: 'static';
    value: StaticEvaluationValue;
    dependencies: ResolvedModuleId[];
    span: SourceSpan;
    /**
     * Present only when normalization received syntax-level literal input:
     * a string, number, boolean, or null AST literal, or JSXText. Template
     * literals, constant-folded expressions, and values reached through a
     * binding are evaluated static values but do not have literal origin.
     */
    literalOrigin?: true;
} | {
    kind: 'bailout';
    bailout: BailoutReason;
    span: SourceSpan;
};
export type MaterializedElementEntry = {
    kind: 'prop';
    name: string;
    span: SourceSpan;
    value: MaterializedValue;
} | {
    kind: 'spread';
    span: SourceSpan;
    value: MaterializedValue;
} | {
    kind: 'child';
    span: SourceSpan;
    value: MaterializedValue | {
        kind: 'element';
        span: SourceSpan;
    } | {
        kind: 'empty';
        span: SourceSpan;
    };
};
export interface MaterializedElement {
    kind: 'element';
    form: ElementIR['form'];
    id: ResolvedModuleId;
    span: SourceSpan;
    propsSpan: SourceSpan | null;
    component: ElementComponentIR;
    complete: boolean;
    entries: MaterializedElementEntry[];
    bailouts: BailoutReason[];
}
export interface MaterializedStyledDefinition {
    kind: 'styled-definition';
    id: ResolvedModuleId;
    name: string;
    span: SourceSpan;
    definitionSpan: SourceSpan;
    factory: ComponentImportProvenance;
    base: ElementComponentIR;
    baseClassName: MaterializedValue | null;
    options: MaterializedValue;
    complete: boolean;
    bailouts: BailoutReason[];
}
export interface MaterializedModule {
    version: 1;
    id: ResolvedModuleId;
    inputHash: string;
    elements: MaterializedElement[];
    styledDefinitions: MaterializedStyledDefinition[];
    diagnostics: BailoutReason[];
    dependencies: ResolvedModuleId[];
}
export declare function materializeModule(graph: ProjectGraph, id: ResolvedModuleId): MaterializedModule;
//# sourceMappingURL=materialize.d.ts.map