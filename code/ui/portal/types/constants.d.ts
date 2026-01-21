/**
 * Check if teleport is enabled (best portal option - preserves React context)
 */
export declare const isTeleportEnabled: () => boolean;
/**
 * Check if we need to manually re-propagate React context through portals.
 * When teleport is enabled, context is automatically preserved.
 * Otherwise, on native platforms we need to manually forward context.
 */
export declare const needsPortalRepropagation: () => boolean;
export declare const allPortalHosts: Map<string, HTMLElement>;
export declare const portalListeners: Record<string, Set<Function>>;
//# sourceMappingURL=constants.d.ts.map