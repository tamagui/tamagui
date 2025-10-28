import type { PxValue, TokenCategories, Variable } from './types';
type VariableIn<A = any> = Pick<Variable<A>, 'key' | 'name' | 'val'>;
export declare const createVariable: <A extends string | number | Variable = any>(props: VariableIn<A>, skipHash?: boolean) => Variable<A>;
export declare function variableToString(vrble?: any, getValue?: boolean): string;
export declare function isVariable(v: Variable | any): v is Variable;
export declare function getVariable(nameOrVariable: Variable | string | any, group?: TokenCategories): any;
export declare const setDidGetVariableValue: (val: boolean) => boolean;
export declare const didGetVariableValue: () => boolean;
export declare function getVariableValue(v: Variable | any, group?: TokenCategories): any;
export declare function getVariableName(v: Variable | any): any;
export declare function getVariableVariable(v: Variable | any): any;
export declare const createCSSVariable: (nameProp: string, includeVar?: boolean) => string;
/**
 * Helper function to mark a token value as needing px units.
 * Usage: px(100) creates a token that will become "100px" on web, 100 on native.
 *
 * @param value - The numeric value
 * @returns A special object that indicates this value needs px units
 */
export declare function px(value: number): PxValue;
export {};
//# sourceMappingURL=createVariable.d.ts.map