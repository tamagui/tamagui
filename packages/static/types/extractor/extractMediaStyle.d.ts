import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { TamaguiInternalConfig } from '@tamagui/core';
import { StyleObject, Ternary } from '../types';
export declare function extractMediaStyle(ternary: Ternary, jsxPath: NodePath<t.JSXElement>, tamaguiConfig: TamaguiInternalConfig, sourcePath: string, importance?: number, shouldPrintDebug?: boolean): {
    mediaStyles: StyleObject[];
    ternaryWithoutMedia: Ternary | null;
} | null;
export declare function isValidMediaCall(jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourcePath: string): boolean;
//# sourceMappingURL=extractMediaStyle.d.ts.map