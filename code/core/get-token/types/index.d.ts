import type { Variable, VariableValGeneric } from '@tamagui/web';
type GetTokenBase = Variable | string | number | boolean | undefined | VariableValGeneric;
export declare const getSize: (size: GetTokenBase) => Variable<number>;
export declare const getSpace: (space: GetTokenBase) => Variable<number>;
export declare const getRadius: (radius: GetTokenBase) => Variable<number>;
export declare const oneSizeTokenSmaller: (token: GetTokenBase) => string;
export {};
//# sourceMappingURL=index.d.ts.map