import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ExtractedAttr, Ternary } from '../types';
export declare function isPresent<T extends Object>(input: null | void | undefined | T): input is T;
export declare function isSimpleSpread(node: t.JSXSpreadAttribute): boolean;
export declare const attrStr: (attr?: ExtractedAttr | undefined) => string | t.JSXIdentifier;
export declare const objToStr: (obj: any, spacer?: string) => any;
export declare const ternaryStr: (x: Ternary) => string;
export declare function findComponentName(scope: any): string | undefined;
export declare function isValidThemeHook(jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourcePath: string): boolean;
export declare const isInsideTamagui: (srcName: string) => boolean;
//# sourceMappingURL=extractHelpers.d.ts.map