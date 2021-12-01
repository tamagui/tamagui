import { Variable } from './createVariable';
declare type GenericTheme = {
    [key: string]: string | Variable;
};
export declare const createTheme: <Theme extends GenericTheme>(theme: Theme) => Theme;
export {};
//# sourceMappingURL=createTheme.d.ts.map