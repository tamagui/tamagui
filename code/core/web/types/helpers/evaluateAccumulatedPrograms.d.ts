import type { AllGroupContexts, GetStyleState } from '../types';
export interface EvaluatedProgramsInfo {
    /** media keys any clause referenced, for the hasMedia subscription */
    usedMediaKeys: string[] | null;
    /** interaction states any clause referenced, for event attachment */
    usedStates: Set<string> | null;
    /**
     * group-context keys any group/container clause referenced (`true`, `card`,
     * `@`, `@card`), for the pseudoGroups subscription set
     */
    usedGroupKeys: Set<string> | null;
    /** container sizes any clause referenced, for the mediaGroups layout math */
    usedGroupSizes: string[] | null;
    /** whether a resolved length references one of the built-in safe-area variables */
    usesSafeArea: boolean;
}
export declare function evaluateAccumulatedPrograms(styleState: GetStyleState, themeName: string, mediaState: Record<string, boolean | undefined>, groupContext: AllGroupContexts | null | undefined): EvaluatedProgramsInfo;
//# sourceMappingURL=evaluateAccumulatedPrograms.d.ts.map