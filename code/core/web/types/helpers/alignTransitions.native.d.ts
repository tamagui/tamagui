import { type TransitionContribution } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
export declare const transitionLonghandKeys: ReadonlySet<string>;
export declare function hasTopLevelClause(value: string): boolean;
export declare function applyAccumulatedTransitions(styleState: GetStyleState): void;
export declare function accumulateTransition(styleState: GetStyleState, prop: TransitionContribution['prop'], value: string): void;
//# sourceMappingURL=alignTransitions.native.d.ts.map