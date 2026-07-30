import type { StyleObject } from '@tamagui/helpers';
import type { GetStyleState } from '../types';
export declare function lowerAccumulatedPrograms(styleState: GetStyleState, addStyleObject: (styleObject: StyleObject) => void): void;
/** test-only: the lowered-program memo, for cache behavior assertions */
export declare function getLoweredProgramCacheSize(): number;
export declare function resetLoweredProgramCache(): void;
//# sourceMappingURL=lowerAccumulatedPrograms.d.ts.map