import type { VariablesProps } from '../types';
/**
 * Anonymous inline theme patch: redefines theme keys and config-declared
 * custom variables for the subtree. See plans/variables.md.
 *
 * Both platforms provide an inline theme layer (a merged theme riding the
 * existing theme-state subscription) so JS theme readers (useTheme().val,
 * animation drivers) see patched values. On web, styles additionally compile
 * to CSS custom properties on this node, so styled consumers restyle with
 * zero re-renders and dark/light values apply via scheme-scoped selectors.
 */
export declare function Variables(props: VariablesProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Variables.d.ts.map