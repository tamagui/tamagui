/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */
declare const IS_VAR = "isVar";
type VariableIn<A = any> = {
    val: A;
    name: string;
    key: string;
};
export type Variable<A = any> = A extends {
    [IS_VAR]?: boolean;
} ? A : VariableIn<A> & {
    [IS_VAR]?: true;
    variable?: string;
};
export declare const createVariable: <A extends string | number = any>(props: VariableIn<A>) => VariableIn<A> | {
    isVar: boolean;
    key: never;
    name: string;
    val: never;
    variable: string;
};
export declare function variableToString(vrble?: any, getValue?: boolean): any;
export declare function isVariable(v: Variable | any): v is Variable;
export declare function getVariable(nameOrVariable: Variable | string): any;
export declare const setDidGetVariableValue: (val: boolean) => boolean;
export declare const didGetVariableValue: () => boolean;
export declare function getVariableValue(v: Variable | any): any;
export declare function getVariableName(v: Variable | any): any;
export declare function getVariableVariable(v: Variable | any): any;
export declare const createCSSVariable: (nameProp: string, includeVar?: boolean) => string;
export {};
//# sourceMappingURL=createVariable.d.ts.map