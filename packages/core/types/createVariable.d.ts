/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */
declare const IS_VAR = "isVar";
declare type VariableIn<A = any> = {
    val: A;
    name: string;
    key: string;
};
export declare type Variable<A = any> = VariableIn<A> & {
    [IS_VAR]?: true;
    variable?: string;
};
export declare const createVariable: <A extends string | number = any>(props: VariableIn<A>) => VariableIn<A> | {
    isVar: boolean;
    key: string;
    name: string;
    val: A;
    variable: string;
};
export declare function variableToString(vrble?: any, getValue?: boolean): string;
export declare function isVariable(v: Variable | any): v is Variable;
export declare function getVariable(nameOrVariable: Variable | string): string;
export declare const setDidGetVariableValue: (val: boolean) => boolean;
export declare const didGetVariableValue: () => boolean;
export declare function getVariableValue(v: Variable | any): any;
export declare function getVariableName(v: Variable | any): any;
export declare function getVariableVariable(v: Variable | any): any;
export declare const createCSSVariable: (nameProp: string, includeVar?: boolean) => string;
export {};
//# sourceMappingURL=createVariable.d.ts.map