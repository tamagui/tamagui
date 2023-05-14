import type { SizeTokens, SpaceTokens, Variable } from '@tamagui/core';
export declare const getSize: (size?: SizeTokens | undefined, shift?: number, bounds?: number[]) => Variable<number>;
export declare const getSpace: (size?: SpaceTokens | undefined, shift?: number, bounds?: number[]) => Variable<number>;
/** @deprecated use getTokenRelative instead */
export declare const stepTokenUpOrDown: (type: 'size' | 'space' | 'zIndex' | 'radius', name?: SizeTokens | SpaceTokens | string, shift?: number, bounds?: number[]) => Variable<number>;
export declare const getTokenRelative: (type: 'size' | 'space' | 'zIndex' | 'radius', name?: SizeTokens | SpaceTokens | string, shift?: number, bounds?: number[]) => Variable<number>;
//# sourceMappingURL=index.d.ts.map