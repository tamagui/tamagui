/**
 * Merges props with special handling for style, className, ref, and event handlers.
 * Used by Slot and render prop implementations.
 *
 * @param base - Base props (typically from parent/slot)
 * @param overlay - Props to merge on top (typically from child/element)
 * @returns Merged props object (mutates and returns base for perf)
 */
export declare function mergeSlotStyleProps(base: Record<string, any>, overlay: Record<string, any>): Record<string, any>;
//# sourceMappingURL=mergeSlotStyleProps.d.ts.map