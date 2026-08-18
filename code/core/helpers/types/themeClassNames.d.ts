/**
 * The theme classes a `<Theme>` span carries for a resolved theme name.
 *
 * Every level of a compound name gets its own class so CSS variables inherit
 * through the whole chain ("red_surface1" is `t_red t_red_surface1`). The zero
 * compiler emits these directly, so this has to be the only implementation:
 * a compiled span that spells its classes differently would resolve different
 * variables than the runtime does for the same authored tree.
 */
export declare function getThemeClassNames(name: string, isRoot?: boolean): string;
//# sourceMappingURL=themeClassNames.d.ts.map