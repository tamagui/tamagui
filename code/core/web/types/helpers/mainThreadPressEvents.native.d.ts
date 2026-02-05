/**
 * Fallback press handling using React Native's usePressability
 * Split into separate file to avoid deep import warnings when RNGH is enabled
 *
 * NOTE: This hook must be called unconditionally in the parent to avoid
 * rules of hooks violations when disabled toggles. The `enabled` param
 * controls whether the pressability events are actually applied.
 */
export declare function useMainThreadPressEvents(events: any, viewProps: any, enabled?: boolean): void;
//# sourceMappingURL=mainThreadPressEvents.native.d.ts.map