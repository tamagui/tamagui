import type { Variable } from './createVariable';
type GenericTheme = {
    [key: string]: string | Variable;
};
export declare const createTheme: <Theme extends GenericTheme>(theme: Theme) => { [K in keyof Theme]: any; };
export {};
//# sourceMappingURL=createTheme.d.ts.map