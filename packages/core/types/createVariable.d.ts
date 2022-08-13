declare const IS_VAR = "__isVar__";
export declare type VariableValue = string | number;
declare type VariableIn<A extends VariableValue = VariableValue> = {
    val: A;
    name: string;
    key: string;
    isFloating?: boolean;
};
export declare type Variable<A extends VariableValue = VariableValue> = VariableIn<A> & {
    [IS_VAR]?: true;
    variable?: string;
};
export declare const createVariable: <A extends string | number = any>(props: VariableIn<A>) => VariableIn<A> | {
    variable: string;
    val: A;
    name: string;
    key: string;
    isFloating?: boolean | undefined;
    __isVar__: boolean;
};
export declare function variableToString(vrble?: any): string;
export declare function isVariable(v: Variable | any): v is Variable;
export declare function getVariableValue(v: Variable | any): any;
export declare function getVariableName(v: Variable | any): any;
export declare function getVariableVariable(v: Variable | any): any;
export declare const createCSSVariable: (nameProp: string, includeVar?: boolean) => string;
export {};
//# sourceMappingURL=createVariable.d.ts.map