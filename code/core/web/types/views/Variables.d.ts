import type { VariablesProps } from '../types';
/**
 * @deprecated Set theme values directly on `<Theme>` instead. The objects
 * collapse into props and the `themes` map becomes the same `dark:` modifier
 * the style grammar already uses:
 * `<Theme background-hover="blue4 dark:blue2">`. This component is a thin
 * front door on the same inline layer and will be removed.
 *
 * Anonymous inline theme patch: redefines theme keys and config-declared
 * custom variables for the subtree. See plans/variables.md.
 *
 * Both platforms provide an inline theme layer (a merged theme riding the
 * existing theme-state subscription) so JS theme readers (useTheme().val,
 * animation drivers) see patched values. On web, styles additionally compile
 * to CSS custom properties on this node, so styled consumers restyle with
 * zero re-renders and themes-map values apply via theme-class-scoped
 * selectors (scheme-scoped with inversion handling for dark/light).
 */
export declare function Variables(props: VariablesProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Variables.d.ts.map