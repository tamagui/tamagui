import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { TamaguiConfig } from '@tamagui/core-node';
export declare function createEvaluator({ tamaguiConfig, staticNamespace, sourcePath, traversePath, shouldPrintDebug, }: {
    tamaguiConfig: TamaguiConfig;
    staticNamespace: Record<string, any>;
    sourcePath: string;
    traversePath?: NodePath<t.JSXElement>;
    shouldPrintDebug: boolean | 'verbose';
}): (n: t.Node) => any;
export declare function createSafeEvaluator(attemptEval: (n: t.Node) => any): (n: t.Node) => any;
//# sourceMappingURL=createEvaluator.d.ts.map