import { Variable } from './createVariable';
import { CreateTokens } from './types';
export declare function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T>;
declare type MakeTokens<T> = T extends {
    color: infer E;
    space: infer F;
    size: infer G;
    radius: infer H;
    zIndex: infer J;
} ? {
    color: {
        [Key in keyof E]: Variable<E[Key]>;
    };
    space: {
        [Key in keyof F]: Variable<F[Key]>;
    };
    size: {
        [Key in keyof G]: Variable<G[Key]>;
    };
    radius: {
        [Key in keyof H]: Variable<H[Key]>;
    };
    zIndex: {
        [Key in keyof J]: Variable<J[Key]>;
    };
} : never;
export {};
//# sourceMappingURL=createTokens.d.ts.map