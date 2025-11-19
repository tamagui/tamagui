import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { TamaguiInternalConfig } from '@tamagui/core';
import * as core from '@tamagui/core';
import type { TamaguiOptionsWithFileInfo, Ternary } from '../types';
export declare function extractMediaStyle(props: TamaguiOptionsWithFileInfo, ternary: Ternary, jsxPath: NodePath<t.JSXElement>, tamaguiConfig: TamaguiInternalConfig, sourcePath: string, importance?: number, shouldPrintDebug?: boolean | 'verbose'): {
    mediaStyles: core.StyleObject[];
    ternaryWithoutMedia: Ternary | null;
} | null;
export declare function isValidMediaCall(props: TamaguiOptionsWithFileInfo, jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourcePath: string): boolean;
//# sourceMappingURL=extractMediaStyle.d.ts.map