import type { CandidateFactory, ExpressionReference, HostModuleInput, HostResolvedProject, ResolvedModuleId, SymbolDefinition, SymbolResolver } from './contracts';
import { type BailoutReason } from './diagnostics';
import { type EvaluationResult } from './evaluate';
import type { ElementIRResult } from './ir';
export interface GraphInvalidation {
    changed: boolean;
    id: ResolvedModuleId;
    previousHash: string | null;
    contentHash: string | null;
    invalidatedIds: ResolvedModuleId[];
}
export declare function moduleContentHash(input: HostModuleInput): string;
/**
 * Long-lived semantic graph. The host owns resolution and supplies every canonical id;
 * this service owns parsing, linking, hashes, reverse edges, IR, and evaluation caches.
 */
export declare class ProjectGraph implements SymbolResolver {
    #private;
    constructor(factory: CandidateFactory, project: HostResolvedProject);
    moduleIds(): ResolvedModuleId[];
    contentHash(id: ResolvedModuleId): string | null;
    sourceOf(id: ResolvedModuleId): string;
    dependenciesOf(id: ResolvedModuleId): ResolvedModuleId[];
    dependentsOf(id: ResolvedModuleId): ResolvedModuleId[];
    affectedBy(id: ResolvedModuleId): ResolvedModuleId[];
    parseCount(id: ResolvedModuleId): number;
    resolveBinding(id: ResolvedModuleId, localName: string): SymbolDefinition | null;
    expressionNode(reference: ExpressionReference): import("./contracts").AstNode | null;
    evaluate(reference: ExpressionReference): EvaluationResult;
    evaluateBinding(id: ResolvedModuleId, localName: string): EvaluationResult;
    elementsOf(id: ResolvedModuleId): ElementIRResult;
    diagnostics(): BailoutReason[];
    updateModule(input: HostModuleInput): GraphInvalidation;
    removeModule(id: ResolvedModuleId): GraphInvalidation;
}
//# sourceMappingURL=graph.d.ts.map