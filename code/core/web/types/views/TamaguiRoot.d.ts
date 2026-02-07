import React from 'react';
/**
 * Applies default font class and CSS variable inheritance via display:contents.
 * Used by TamaguiProvider at the root and by portals to re-establish font scope.
 * Pass trackMount to also handle the t_unmounted class for CSS animation gating.
 */
export declare function TamaguiRoot(props: {
    children: React.ReactNode;
    trackMount?: boolean;
    style?: React.CSSProperties;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TamaguiRoot.d.ts.map