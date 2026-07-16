import type { VariablesProps } from '../types';
/**
 * Anonymous inline theme patch: redefines theme keys and config-declared
 * custom variables for the subtree. On web this is pure CSS custom property
 * redefinition — consumers restyle with zero re-renders. dark/light values
 * compile under scheme-scoped selectors.
 *
 * See plans/variables.md. Native support (inline theme layer) lands in the
 * follow-up packet; until then Variables is a no-op passthrough on native.
 */
export declare function Variables(props: VariablesProps): any;
//# sourceMappingURL=Variables.d.ts.map