/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@snackui/static" {
    export const CSS_FILE_NAME = "__snack.css";
    export const MEDIA_SEP = "_";
    export const cacheDir: any;
    export const shouldInternalDedupe: boolean;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/core";
    import * as t from "@babel/types";
    import { MediaQueries } from "@snackui/node";
    import { ViewStyle } from "react-native";
    export type ClassNameObject = t.StringLiteral | t.Expression;
    export interface CacheObject {
        [key: string]: any;
    }
    export interface SnackOptions {
        themesFile?: string;
        evaluateVars?: boolean;
        evaluateImportsWhitelist?: string[];
        exclude?: RegExp;
        mediaQueries?: MediaQueries;
        cssPath?: string;
        deoptProps?: string[];
        excludeProps?: string[];
    }
    export type ExtractedAttrAttr = {
        type: 'attr';
        value: t.JSXAttribute | t.JSXSpreadAttribute;
    };
    export type ExtractedAttr = ExtractedAttrAttr | {
        type: 'ternary';
        value: Ternary;
    };
    export type ExtractTagProps = {
        attrs: ExtractedAttr[];
        node: t.JSXOpeningElement;
        attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any;
        viewStyles: ViewStyle;
        jsxPath: NodePath<t.JSXElement>;
        originalNodeName: string;
        lineNumbers: string;
        filePath: string;
    };
    export type ExtractorParseProps = SnackOptions & {
        sourceFileName?: string;
        shouldPrintDebug?: boolean;
        onExtractTag: (props: ExtractTagProps) => void;
        getFlattenedNode: (props: {
            isTextView: boolean;
        }) => string;
        disableThemes?: boolean;
    };
    export interface Ternary {
        test: t.Expression;
        remove: Function;
        consequent: Object | null;
        alternate: Object | null;
    }
    export type StyleObject = {
        property: string;
        value: string;
        className: string;
        identifier: string;
        rules: string[];
    };
    export type ClassNameToStyleObj = {
        [key: string]: StyleObject;
    };
    export interface PluginContext {
        write: (path: string, rules: {
            [key: string]: string;
        }) => any;
    }
}

declare module "@snackui/static" {
    export const pseudos: {
        focusWithinStyle: {
            name: string;
            priority: number;
        };
        focusStyle: {
            name: string;
            priority: number;
        };
        pressStyle: {
            name: string;
            priority: number;
        };
        hoverStyle: {
            name: string;
            priority: number;
        };
    };
    export function getStylesAtomic(style: any): StyleObject[];
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export function evaluateAstNode(exprNode: t.Node, evalFn?: (node: t.Node) => any, shouldPrintDebug?: boolean): any;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    export function isPresent<T extends Object>(input: null | void | undefined | T): input is T;
    export function isSimpleSpread(node: t.JSXSpreadAttribute): boolean;
    export const attrGetName: (attr: ExtractedAttr) => string;
    export const getNameTernary: (x: Ternary) => string;
    export function findComponentName(scope: any): string | undefined;
    export function isValidThemeHook(jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourceFileName: string): boolean;
    export const isInsideSnackUI: (srcName: string) => boolean;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    export function findTopmostFunction(jsxPath: NodePath<t.JSXElement>): NodePath<any> | null;
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export interface SourceModule {
        sourceModule?: string;
        imported?: string;
        local?: string;
        destructured?: boolean;
        usesImportSyntax: boolean;
    }
    export function getSourceModule(itemName: string, itemBinding: {
        constant?: boolean;
        path: {
            node: t.Node;
            parent: any;
        };
    }): SourceModule | null;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    export function getStaticBindingsForScope(scope: NodePath<t.JSXElement>['scope'], whitelist: string[] | undefined, sourceFileName: string, bindingCache: Record<string, string | null>, shouldPrintDebug: boolean): Record<string, any>;
}

declare module "@snackui/static" {
    export function literalToAst(literal: any): any;
}

declare module "@snackui/static" {
    export function normalizeTernaries(ternaries: Ternary[]): Ternary[];
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    export function removeUnusedHooks(compFn: NodePath<any>, shouldPrintDebug: boolean): void;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    export type Extractor = ReturnType<typeof createExtractor>;
    export function createExtractor(): {
        parse: (path: NodePath<t.Program>, { evaluateImportsWhitelist, evaluateVars, themesFile, shouldPrintDebug, sourceFileName, onExtractTag, getFlattenedNode, disableThemes, ...props }: ExtractorParseProps) => null | undefined;
    };
}

declare module "@snackui/static" {
    import * as babelParser from "@babel/parser";
    export const parserOptions: babelParser.ParserOptions;
    export function babelParse(code: string | Buffer): import("@babel/types").File;
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export function buildClassName(classNameObjects: ClassNameObject[]): t.Expression | t.StringLiteral | null;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    export function ensureImportingConcat(path: NodePath<t.Program>): void;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/traverse";
    import * as t from "@babel/types";
    import { MediaQueries } from "@snackui/node";
    export function extractMediaStyle(ternary: Ternary, jsxPath: NodePath<t.JSXElement>, mediaQueries: MediaQueries, sourceFileName: string, importance?: number, shouldPrintDebug?: boolean): StyleObject[] | null;
    export function isValidMediaCall(jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourceFileName: string): boolean;
}

declare module "@snackui/static" {
    import { NodePath } from "@babel/core";
    import * as t from "@babel/types";
    export function hoistClassNames(path: NodePath<t.JSXElement>, existing: {
        [key: string]: t.Identifier;
    }, expr: t.Expression): any;
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export const CONCAT_CLASSNAME_IMPORT = "concatClassName";
    export function getInitialFileName(): string;
    export function extractToClassNames(extractor: Extractor, src: string | Buffer, sourceFileName: string, options: SnackOptions, addDependency: (path: string) => void, shouldPrintDebug: boolean): null | {
        js: string | Buffer;
        styles: string;
        stylesPath?: string;
        ast: t.File;
        map: any;
    };
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export function accessSafe(obj: t.Expression, member: string): t.LogicalExpression;
}

declare module "@snackui/static" {
    module '@babel/types' {
        function toIdentifier(input: string): string;
    }
    export function generateUid(scope: any, name: string): string;
}

declare module "@snackui/static" {
    import * as t from "@babel/types";
    export function getPropValueFromAttributes(propName: string, attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[]): t.Expression | null;
}
//# sourceMappingURL=types.d.ts.map
