import type { ThemeUpdateState } from '../helpers/themeUpdateState';
export type PortalThemeState = {
    name: string;
    /** Root-most first, so a consumer can replay them in authored order. */
    layers: ThemeUpdateState[];
};
/**
 * The theme state a portal must carry across the mount boundary.
 *
 * A name alone is not enough: `<ThemeUpdate background="#0b2545">` puts its
 * values on a CSS custom-property node in the mount ancestry, and portaled
 * content is not a descendant of that node.
 */
export declare function usePortalThemeState(): PortalThemeState;
//# sourceMappingURL=usePortalThemeState.d.ts.map