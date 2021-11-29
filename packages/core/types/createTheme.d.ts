import { Variable } from './createVariable';
export declare const createTheme: <Theme extends {
    [key: string]: string | Variable;
}>(theme: Theme) => { [key in keyof Theme]: string | Variable; };
//# sourceMappingURL=createTheme.d.ts.map