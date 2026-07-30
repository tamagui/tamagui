import type { GetStyleState } from '../types';
export interface EvaluatedProgramsInfo {
    /** media keys any clause referenced, for the hasMedia subscription */
    usedMediaKeys: string[] | null;
    /** interaction states any clause referenced, for event attachment */
    usedStates: Set<string> | null;
}
export declare function evaluateAccumulatedPrograms(styleState: GetStyleState, themeName: string, mediaState: Record<string, boolean | undefined>): EvaluatedProgramsInfo;
//# sourceMappingURL=evaluateAccumulatedPrograms.d.ts.map