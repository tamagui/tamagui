import type { TransitionProp, PseudoTransitions, TamaguiComponentState } from '../types';
/**
 * Pseudo state for tracking enter/exit transitions
 */
export type PseudoState = {
    hover?: boolean;
    press?: boolean;
    focus?: boolean;
    groups?: Record<string, {
        hover?: boolean;
        press?: boolean;
        focus?: boolean;
    }>;
};
/**
 * Resolves the effective transition based on pseudo state changes.
 * When entering a pseudo state (e.g., hover), use that pseudo's transition.
 * When exiting (returning to base), use the base transition.
 *
 * CSS-like semantics:
 * - Enter hover: Uses hover's transition (fast snap)
 * - Exit hover: Uses base transition (slow fade)
 */
export declare function resolveEffectivePseudoTransition(prev: PseudoState | undefined, next: TamaguiComponentState, pseudoTransitions: PseudoTransitions | undefined | null, baseTransition: TransitionProp | undefined | null): TransitionProp | undefined | null;
/**
 * Extracts pseudo state from TamaguiComponentState for storage in prevPseudoState
 */
export declare function extractPseudoState(state: TamaguiComponentState): PseudoState;
//# sourceMappingURL=pseudoTransitions.d.ts.map