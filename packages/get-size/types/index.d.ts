import { Variable } from '@tamagui/core';
import type { SizeTokens, SpaceTokens } from '@tamagui/core';
type GenericTokens = Record<string, Variable<any>>;
export declare const getSize: (size?: SizeTokens | undefined, shift?: number, bounds?: number[]) => Variable<any>;
export declare const stepTokenUpOrDown: (tokens: GenericTokens, current?: SizeTokens | SpaceTokens | string, shift?: number, bounds?: number[]) => Variable<any>;
export {};
//# sourceMappingURL=index.d.ts.map