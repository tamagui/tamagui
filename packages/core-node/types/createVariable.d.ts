declare const IS_VARIABLE_SYMBOL = "__isVariable__";
declare type VariableIn<A extends string | number = any> = {
    val: A;
    name: string;
    key: string;
    isFloating?: boolean;
};
export declare class Variable<A extends string | number = any> {
    [IS_VARIABLE_SYMBOL]: boolean;
    key: string;
    name: string;
    val: A;
    variable: string;
    isFloating: boolean;
    constructor(props: VariableIn);
    toString(): string;
}
export declare const createVariable: <A extends string | number = any>(props: VariableIn<A>) => Variable<any>;
export declare function isVariable(v: Variable | any): v is Variable;
export declare function getVariableValue(v: Variable | any): any;
export declare function getVariableName(v: Variable | any): any;
export declare const createCSSVariable: (nameProp: string, includeVar?: boolean) => string;
export {};
//# sourceMappingURL=createVariable.d.ts.map