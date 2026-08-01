import { type TransitionContribution } from '@tamagui/style-grammar';
import type { GetStyleState } from '../types';
export declare const transitionLonghandKeys: ReadonlySet<string>;
/**
 * Conditional transition clauses (`transition="200ms hover:400ms"`) SHIP
 * TODAY through the program engine, so a clause-bearing shorthand must keep
 * that exact path — the accumulator only owns clause-free contributions.
 * Same top-level-colon rule as the value parser: a colon outside parens and
 * strings starts a clause.
 */
export declare function hasTopLevelClause(value: string): boolean;
export declare function applyAccumulatedTransitions(styleState: GetStyleState): void;
export declare function accumulateTransition(styleState: GetStyleState, prop: TransitionContribution['prop'], value: string): void;
//# sourceMappingURL=alignTransitions.d.ts.map