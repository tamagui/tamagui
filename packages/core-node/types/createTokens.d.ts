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
        [Key in keyof E]: E[Key] extends Variable ? E[Key] : Variable<E[Key]>;
    };
    space: {
        [Key in keyof F]: F[Key] extends Variable ? F[Key] : Variable<F[Key]>;
    };
    size: {
        [Key in keyof G]: G[Key] extends Variable ? G[Key] : Variable<G[Key]>;
    };
    radius: {
        [Key in keyof H]: H[Key] extends Variable ? H[Key] : Variable<H[Key]>;
    };
    zIndex: {
        [Key in keyof J]: J[Key] extends Variable ? J[Key] : Variable<J[Key]>;
    };
} : never;
export {};
//# sourceMappingURL=createTokens.d.ts.map