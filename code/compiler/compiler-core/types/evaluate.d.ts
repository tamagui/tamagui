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
export interface ConditionalEvaluation {
    /** Span of the test expression, sliced verbatim into compiled output. */
    test: SourceSpan;
    whenTrue: {
        value: StaticEvaluationValue;
        dependencies: ResolvedModuleId[];
    };
    whenFalse: {
        value: StaticEvaluationValue;
        dependencies: ResolvedModuleId[];
    };
}
/**
 * A conditional whose test resists static evaluation while both branches
 * evaluate: `cond ? 'body' : 'heading'`. Plain evaluation bails on the test;
 * this recovers the branch values so a lowering can resolve each branch at
 * compile time and leave only the test in the output. Returns null for any
 * other expression shape — the caller keeps its ordinary bailout.
 */
export declare function evaluateConditionalExpression(resolver: SymbolResolver, reference: ExpressionReference): ConditionalEvaluation | null;
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