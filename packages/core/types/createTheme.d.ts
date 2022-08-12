import { Variable } from './createVariable';
declare type GenericTheme = {
    [key: string]: string | Variable;
};
export declare const createTheme: <Theme extends GenericTheme>(theme: Theme) => { [K in keyof Theme]: string | Variable<import("./createVariable").VariableValue> | Theme[K]; };
export {};
//# sourceMappingURL=createTheme.d.ts.map