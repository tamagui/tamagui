import type { Variable } from '@tamagui/web';
export declare const getSize: (size: Variable, shift?: number, bounds?: number[]) => Variable<number>;
export declare const getSpace: (space: Variable, shift?: number, bounds?: number[]) => Variable<number>;
/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export declare const stepTokenUpOrDown: (type: 'size' | 'space' | 'zIndex' | 'radius', token: Variable, shift?: number, bounds?: number[]) => Variable<number>;
export declare const getTokenRelative: (type: 'size' | 'space' | 'zIndex' | 'radius', token: Variable, shift?: number, bounds?: number[]) => Variable<number>;
//# sourceMappingURL=index.d.ts.map