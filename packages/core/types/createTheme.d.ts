import { Variable } from './createVariable';
declare type GenericTheme = {
    [key: string]: string | Variable;
};
export declare const createTheme: <Theme extends GenericTheme>(theme: Theme) => { [key in keyof Theme]?: string | Variable | undefined; };
export {};
//# sourceMappingURL=createTheme.d.ts.map