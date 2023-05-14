import type { Variable } from '@tamagui/web';
type GetTokenOptions = {
    shift?: number;
    bounds?: [number] | [number, number];
};
export declare const getSize: (size: Variable, options?: GetTokenOptions) => Variable<number>;
export declare const getSpace: (space: Variable, options?: GetTokenOptions) => Variable<number>;
/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export declare const stepTokenUpOrDown: (type: 'size' | 'space' | 'zIndex' | 'radius', token: Variable, options?: GetTokenOptions) => Variable<number>;
export declare const getTokenRelative: (type: 'size' | 'space' | 'zIndex' | 'radius', token: Variable, options?: GetTokenOptions) => Variable<number>;
export {};
//# sourceMappingURL=index.d.ts.map