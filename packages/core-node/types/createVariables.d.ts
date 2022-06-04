import { Variable } from './createVariable';
declare type TokenObject = {
    [key: string]: string | number;
};
declare type DeepTokenObject = {
    [key: string]: string | number | TokenObject;
};
declare type DeepVariableObject<A extends DeepTokenObject> = {
    [Key in keyof A]: A[Key] extends string | number ? Variable<A[Key]> : A[Key] extends TokenObject ? DeepVariableObject<A[Key]> : never;
};
export declare const createVariables: <A extends DeepTokenObject>(tokens: A, parentPath?: string) => DeepVariableObject<A>;
export {};
//# sourceMappingURL=createVariables.d.ts.map