import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { PseudoStyles, StaticConfig } from '@tamagui/core-node';
import type { StyleObject } from '@tamagui/helpers';
import type { TamaguiOptions } from '@tamagui/helpers-node';
import type { ViewStyle } from 'react-native';
export type { TamaguiOptions } from '@tamagui/helpers-node';
export type { StyleObject } from '@tamagui/helpers';
export declare type ClassNameObject = t.StringLiteral | t.Expression;
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
export declare type ExtractorOptions = {
    logger?: Logger;
};
export declare type ExtractedAttrAttr = {
    type: 'attr';
    value: t.JSXAttribute | t.JSXSpreadAttribute;
};
export declare type ExtractedAttrStyle = {
    type: 'style';
    value: ViewStyle & PseudoStyles;
    attr?: t.JSXAttribute | t.JSXSpreadAttribute;
    name?: string;
};
export declare type ExtractedAttr = ExtractedAttrAttr | {
    type: 'ternary';
    value: Ternary;
} | ExtractedAttrStyle;
export declare type ExtractTagProps = {
    attrs: ExtractedAttr[];
    node: t.JSXOpeningElement;
    attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any;
    jsxPath: NodePath<t.JSXElement>;
    programPath: NodePath<t.Program>;
    originalNodeName: string;
    lineNumbers: string;
    filePath: string;
    isFlattened: boolean;
    completeProps: Record<string, any>;
    staticConfig: StaticConfig;
};
export declare type TamaguiOptionsWithFileInfo = TamaguiOptions & {
    sourcePath: string;
};
export declare type ExtractorParseProps = TamaguiOptionsWithFileInfo & {
    target: 'native' | 'html';
    shouldPrintDebug?: boolean | 'verbose';
    onExtractTag: (props: ExtractTagProps) => void;
    getFlattenedNode?: (props: {
        isTextView: boolean;
        tag: string;
    }) => string;
    extractStyledDefinitions?: boolean;
    onStyleRule?: (identifier: string, rules: string[]) => void;
};
export interface Ternary {
    test: t.Expression;
    inlineMediaQuery?: string;
    remove: Function;
    consequent: Object | null;
    alternate: Object | null;
}
export declare type ClassNameToStyleObj = {
    [key: string]: StyleObject;
};
export interface PluginContext {
    write: (path: string, rules: {
        [key: string]: string;
    }) => any;
}
//# sourceMappingURL=types.d.ts.map