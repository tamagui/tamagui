import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TamaguiInternalConfig } from '@tamagui/core-node';
import type { Ternary } from '../types.js';
export declare function extractMediaStyle(ternary: Ternary, jsxPath: NodePath<t.JSXElement>, tamaguiConfig: TamaguiInternalConfig, sourcePath: string, importance?: number, shouldPrintDebug?: boolean | 'verbose'): {
    mediaStyles: StyleObject[];
    ternaryWithoutMedia: Ternary | null;
} | null;
export declare function isValidMediaCall(jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourcePath: string): boolean;
//# sourceMappingURL=extractMediaStyle.d.ts.map