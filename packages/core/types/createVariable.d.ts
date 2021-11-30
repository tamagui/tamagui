export declare class Variable {
    name: string;
    val: string | number;
    variable: string | number;
    constructor({ val, name }: VariableIn);
    toString(): string;
}
declare type VariableIn = {
    val: string | number;
    name: string;
};
export declare const createVariable: (props: VariableIn) => Variable;
export declare function isVariable(v: Variable | any): v is Variable;
export {};
//# sourceMappingURL=createVariable.d.ts.map