import type { NodePath } from '@babel/traverse';
import type * as t from '@babel/types';
import type { PseudoStyles, StaticConfig, TamaguiConfig } from '@tamagui/core';
import type { StyleObject } from '@tamagui/helpers';
import type { TamaguiOptions } from '@tamagui/types';
import type { ViewStyle } from 'react-native';
import type { LoadedComponents } from './extractor/bundleConfig';
export type TamaguiPlatform = 'native' | 'web';
export type { TamaguiOptions, TamaguiBuildOptions } from '@tamagui/types';
export type { StyleObject } from '@tamagui/helpers';
export type ClassNameObject = t.StringLiteral | t.Expression;
export interface CacheObject {
    [key: string]: any;
}
export interface LogOptions {
    clear?: boolean;
    timestamp?: boolean;
    error?: Error | null;
}
export interface Logger {
    info(msg: string, options?: LogOptions): void;
    warn(msg: string, options?: LogOptions): void;
    error(msg: string, options?: LogOptions): void;
}
export type ExtractorOptions = {
    logger?: Logger;
    platform?: TamaguiPlatform;
};
export type ExtractedAttrAttr = {
    type: 'attr';
    value: t.JSXAttribute | t.JSXSpreadAttribute;
    extraClassNames?: string;
};
export type ExtractedAttrStyle = {
    type: 'style';
    value: ViewStyle & PseudoStyles;
    attr?: t.JSXAttribute | t.JSXSpreadAttribute;
    name?: string;
    extraClassNames?: string;
};
export type ExtractedTernaryAttr = {
    type: 'ternary';
    value: Ternary;
};
export type ExtractedAttr = ExtractedAttrAttr | ExtractedTernaryAttr | ExtractedAttrStyle;
export type ExtractTagProps = {
    parserProps: TamaguiOptionsWithFileInfo;
    attrs: ExtractedAttr[];
    node: t.JSXOpeningElement;
    attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any;
    flatNodeName?: string;
    jsxPath: NodePath<t.JSXElement>;
    programPath: NodePath<t.Program>;
    originalNodeName: string;
    lineNumbers: string;
    filePath: string;
    completeProps: Record<string, any>;
    staticConfig: StaticConfig;
    config: TamaguiConfig;
};
export type TamaguiOptionsWithFileInfo = TamaguiOptions & {
    sourcePath?: string;
    allLoadedComponents: LoadedComponents[];
};
export type ExtractorParseProps = Omit<TamaguiOptionsWithFileInfo, 'allLoadedComponents'> & {
    platform: TamaguiPlatform;
    shouldPrintDebug?: boolean | 'verbose';
    onExtractTag: (props: ExtractTagProps) => void;
    getFlattenedNode?: (props: {
        isTextView: boolean;
        tag: string;
    }) => string;
    extractStyledDefinitions?: boolean;
    onStyledDefinitionRule?: (identifier: string, rules: string[]) => void;
};
export interface Ternary {
    test: t.Expression;
    remove: Function;
    consequent: Object | null;
    alternate: Object | null;
    fontFamily?: string;
    inlineMediaQuery?: string;
}
export type ClassNameToStyleObj = {
    [key: string]: StyleObject;
};
export interface PluginContext {
    write: (path: string, rules: {
        [key: string]: string;
    }) => any;
}
//# sourceMappingURL=types.d.ts.map