import { Variable } from './createVariable';
import { CreateTokens } from './types';
export declare function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T>;
export declare const mapTokensToVariables: (tokens: CreateTokens, parentPath?: string) => CreateTokens<Variable>;
declare type MakeTokens<T> = T extends {
    color: infer E;
    space: infer F;
    size: infer G;
    radius: infer H;
    zIndex: infer J;
} ? {
    color: {
        [key in keyof E]: Variable;
    };
    space: {
        [key in keyof F]: Variable;
    };
    size: {
        [key in keyof G]: Variable;
    };
    radius: {
        [key in keyof H]: Variable;
    };
    zIndex: {
        [key in keyof J]: Variable;
    };
} : never;
export {};
//# sourceMappingURL=createTokens.d.ts.map