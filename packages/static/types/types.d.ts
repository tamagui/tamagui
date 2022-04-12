import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare type ClassNameObject = t.StringLiteral | t.Expression;
export interface CacheObject {
    [key: string]: any;
}
export interface TamaguiOptions {
    components: string[];
    config?: string;
    evaluateVars?: boolean;
    importsWhitelist?: string[];
    disable?: boolean;
    disableExtraction?: boolean;
    disableDebugAttr?: boolean;
    disableExtractInlineMedia?: boolean;
    disableExtractVariables?: boolean;
    excludeReactNativeWebExports?: string[];
    exclude?: RegExp;
    logTimings?: boolean;
    prefixLogs?: string;
    cssPath?: string;
    cssData?: any;
    deoptProps?: Set<string>;
    excludeProps?: Set<string>;
    inlineProps?: Set<string>;
}
export declare type ExtractedAttrAttr = {
    type: 'attr';
    value: t.JSXAttribute | t.JSXSpreadAttribute;
};
export declare type ExtractedAttrStyle = {
    type: 'style';
    value: Object;
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
};
export declare type ExtractorParseProps = TamaguiOptions & {
    sourcePath?: string;
    shouldPrintDebug?: boolean;
    onExtractTag: (props: ExtractTagProps) => void;
    getFlattenedNode: (props: {
        isTextView: boolean;
        tag: string;
    }) => string;
};
export interface Ternary {
    test: t.Expression;
    inlineMediaQuery?: string;
    remove: Function;
    consequent: Object | null;
    alternate: Object | null;
}
export declare type StyleObject = {
    property: string;
    value: string;
    className: string;
    identifier: string;
    rules: string[];
};
export declare type ClassNameToStyleObj = {
    [key: string]: StyleObject;
};
export interface PluginContext {
    write: (path: string, rules: {
        [key: string]: string;
    }) => any;
}
//# sourceMappingURL=types.d.ts.map