import type { ExpressionReference, ResolvedModuleId, SymbolResolver } from './contracts';
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
export declare function evaluateExpression(resolver: SymbolResolver, reference: ExpressionReference): EvaluationResult;
export declare function evaluateBinding(resolver: SymbolResolver, id: ResolvedModuleId, localName: string): EvaluationResult;
//# sourceMappingURL=evaluate.d.ts.map