export declare const IS_VARIABLE_SYMBOL = "__isVariable__";
export declare class Variable {
    [IS_VARIABLE_SYMBOL]: boolean;
    name: string;
    val: string | number;
    variable: string | number;
    constructor({ val, name }: VariableIn);
    toString(): string;
}
declare type VariableIn = {
    val: string | number | Variable;
    name: string;
};
export declare const createVariable: (props: VariableIn) => Variable;
export declare function isVariable(v: Variable | any): v is Variable;
export {};
//# sourceMappingURL=createVariable.d.ts.map