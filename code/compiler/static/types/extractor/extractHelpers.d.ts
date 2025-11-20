import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { ExtractedAttr, TamaguiOptionsWithFileInfo, Ternary } from '../types';
export declare function isPresent<T extends Object>(input: null | void | undefined | T): input is T;
export declare function isSimpleSpread(node: t.JSXSpreadAttribute): boolean;
export declare const attrStr: (attr?: ExtractedAttr) => string | t.JSXIdentifier;
export declare const objToStr: (obj: any, spacer?: string) => any;
export declare const ternaryStr: (x: Ternary) => string;
export declare function findComponentName(scope: any): string | undefined;
export declare function isValidThemeHook(props: TamaguiOptionsWithFileInfo, jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourcePath?: string): boolean;
export declare const isInsideComponentPackage: (props: TamaguiOptionsWithFileInfo, moduleName: string) => any;
export declare const isComponentPackage: (props: TamaguiOptionsWithFileInfo, srcName: string) => any;
export declare function getValidComponent(props: TamaguiOptionsWithFileInfo, moduleName: string, componentName: string): false | {
    staticConfig: import("@tamagui/web").StaticConfig;
} | null;
export declare const isValidModule: (props: TamaguiOptionsWithFileInfo, moduleName: string) => {
    isLocal: boolean;
    isValid: any;
};
export declare const getValidImport: (props: TamaguiOptionsWithFileInfo, moduleName: string, componentName?: string) => {
    staticConfig: import("@tamagui/web").StaticConfig;
} | null;
export declare const isValidImport: (props: TamaguiOptionsWithFileInfo, moduleName: string, componentName?: string) => any;
export declare const getValidComponentsPaths: {
    (...args: any[]): any;
    cache: Map<any, any>;
};
//# sourceMappingURL=extractHelpers.d.ts.map