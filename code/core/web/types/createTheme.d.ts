import type { Variable } from './createVariable';
type GenericTheme = {
    [key: string]: string | Variable;
};
/**
 * @deprecated no need to use this anymore, can just remove the call and use plain objects
 */
export declare const createTheme: <Theme extends GenericTheme>(theme: Theme) => Theme;
export {};
//# sourceMappingURL=createTheme.d.ts.map