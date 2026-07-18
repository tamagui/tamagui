export type SkinManifest = {
    /** one-line human description shown in the registry. */
    description: string;
    /** shadcn registry categories (e.g. 'form', 'overlay'). */
    categories?: string[];
    /**
     * theme token keys the skin assumes exist in the active Tamagui config
     * (e.g. '$background', '$borderColor'). A consumer whose theme lacks these
     * renders without the intended appearance.
     */
    tokens?: string[];
    /** named sub-themes the skin assumes (e.g. component themes), if any. */
    themes?: string[];
    /**
     * native-platform requirements a consumer must satisfy on React Native
     * (e.g. "wrap the app in a Portal provider"). Free-form, human-readable.
     */
    native?: string[];
    /**
     * npm peer dependencies the copied source needs that are NOT inferable from
     * the skin's imports (e.g. react-native-safe-area-context).
     */
    peerDependencies?: string[];
    /**
     * A1 component-tier states the skin responds to that W5 CANNOT derive from a
     * canonical-named variant (see plans/v3-a1-state-vocabulary.md). Use for states
     * styled through a v2-compat prop or a behavior mechanism instead of a
     * `variants: { <state>: {...} }` block — e.g. ListItem's `active` prop
     * (`selected`), ToggleGroup's `activeStyle` (`checked`).
     */
    extraStates?: string[];
};
//# sourceMappingURL=registry-manifest.d.ts.map