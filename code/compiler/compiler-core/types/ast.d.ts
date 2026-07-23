import type { AstNode } from './contracts';
export declare function isAstNode(value: unknown): value is AstNode;
export declare function walkAst(node: AstNode, visitor: (node: AstNode, parent: AstNode | null, key: string | null) => void, parent?: AstNode | null, key?: string | null): void;
export declare function findAstNode(root: AstNode, predicate: (node: AstNode, parent: AstNode | null, key: string | null) => boolean): AstNode | null;
export declare function childNode(node: AstNode, key: string): AstNode | null;
export declare function childNodes(node: AstNode, key: string): AstNode[];
export declare function identifierName(node: AstNode | null): string | null;
export declare function literalValue(node: AstNode | null): unknown;
export declare function unwrapExpression(node: AstNode): AstNode;
//# sourceMappingURL=ast.d.ts.map