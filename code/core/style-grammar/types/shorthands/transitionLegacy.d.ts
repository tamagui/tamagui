import type { TransitionParseResult } from "./transition";
export type LegacyTransitionValue = string | Readonly<Record<string, unknown>> | readonly [string, Readonly<Record<string, unknown>>];
/**
* lowers the legacy array and per-property object forms into transition IR.
* per-property presets and spring overrides remain explicit driver config.
*/
export declare function migrateLegacyTransition(input: LegacyTransitionValue, presetNames: ReadonlySet<string>): TransitionParseResult;

//# sourceMappingURL=transitionLegacy.d.ts.map