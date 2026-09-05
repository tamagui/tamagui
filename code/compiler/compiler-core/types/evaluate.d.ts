import type { ExpressionReference, ResolvedModuleId, SourceSpan, SymbolResolver } from './contracts';
import { type BailoutReason } from './diagnostics';
export type StaticEvaluationValue = string | number | boolean | null | StaticEvaluationValue[] | {
    [key: string]: StaticEvaluationValue;
};
export type EvaluationResult = {
    ok: true;
    value: StaticEvaluationValue;
    dependencies: ResolvedModuleId[];
} | {
    ok: false;
    bailout: BailoutReason;
};
export interface DynamicEvaluation {
    type: 'number' | 'string' | 'boolean' | 'null';
    values?: (number | string | boolean | null)[];
    dependencies: ResolvedModuleId[];
}
export type BranchDecisionNode = {
    kind: 'leaf';
    value?: StaticEvaluationValue;
    dependencies: ResolvedModuleId[];
} | {
    kind: 'branch';
    test: SourceSpan;
    whenTrue: BranchDecisionNode;
    whenFalse: BranchDecisionNode;
};
export declare function collectLeaves(node: BranchDecisionNode): {
    value?: StaticEvaluationValue;
    dependencies: ResolvedModuleId[];
}[];
export declare function collectBranchDependencies(node: BranchDecisionNode): ResolvedModuleId[];
/**
 * A conditional or logical expression whose test resists static evaluation while
 * its branch values evaluate statically or form a decision tree.
 */
export declare function evaluateBranches(resolver: SymbolResolver, reference: ExpressionReference): BranchDecisionNode | null;
export declare function evaluateExpression(resolver: SymbolResolver, reference: ExpressionReference): EvaluationResult;
/**
 * proves the runtime domain of a dynamic expression without evaluating its
 * changing inputs. this is deliberately narrow: numeric arithmetic and a
 * bounded lookup into a static primitive array are the two forms a host style
 * can consume directly without retaining the full Tamagui resolver.
 */
export declare function evaluateDynamicExpression(resolver: SymbolResolver, reference: ExpressionReference): DynamicEvaluation | null;
export declare function evaluateBinding(resolver: SymbolResolver, id: ResolvedModuleId, localName: string): EvaluationResult;
//# sourceMappingURL=evaluate.d.ts.map