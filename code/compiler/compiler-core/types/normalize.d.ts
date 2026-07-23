import { type AnalyzerCandidate, type AstNode, type DefinitionSite, type HostResolvedImport } from './contracts';
import type { ElementIRResult } from './ir';
export declare function definitionFromDeclaration(id: string, name: string, program: AstNode, declaration: AstNode): DefinitionSite;
export declare function normalizeElements(candidate: AnalyzerCandidate, rawId: string, imports?: readonly HostResolvedImport[]): ElementIRResult;
export declare function declarationForName(program: AstNode, name: string): AstNode | null;
export declare function nodeAtSpan(program: AstNode, start: number, end: number): AstNode | null;
export declare function asAstNode(value: unknown, label: string): AstNode;
//# sourceMappingURL=normalize.d.ts.map