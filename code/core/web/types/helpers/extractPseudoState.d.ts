import type { TamaguiComponentState } from '../types.js';
type PseudoState = {
    hover?: boolean;
    press?: boolean;
    focus?: boolean;
    groups?: Record<string, {
        hover?: boolean;
        press?: boolean;
        focus?: boolean;
    }>;
};
export declare function extractPseudoState(state: TamaguiComponentState): PseudoState;
export {};
//# sourceMappingURL=extractPseudoState.d.ts.map