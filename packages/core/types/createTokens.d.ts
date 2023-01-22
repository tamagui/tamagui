import { Variable } from './createVariable';
import { CreateTokens } from './types';
export declare function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T>;
type MakeTokens<T> = T extends {
    color: infer E;
    space: infer F;
    size: infer G;
    radius: infer H;
    zIndex: infer J;
} ? {
    color: {
        [Key in keyof E extends `$${infer X}` ? X : keyof E]: Variable<E[keyof E]>;
    };
    space: {
        [Key in keyof F extends `$${infer X}` ? X : keyof F]: Variable<F[keyof F]>;
    };
    size: {
        [Key in keyof G extends `$${infer X}` ? X : keyof G]: Variable<G[keyof G]>;
    };
    radius: {
        [Key in keyof H extends `$${infer X}` ? X : keyof H]: Variable<H[keyof H]>;
    };
    zIndex: {
        [Key in keyof J extends `$${infer X}` ? X : keyof J]: Variable<J[keyof J]>;
    };
} : never;
export {};
//# sourceMappingURL=createTokens.d.ts.map