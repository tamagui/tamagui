/**
 * Composed resolver for variant-driven Tailwind utilities.
 *
 * This replaces the imperative compose.ts ring/gradient/filter/shadow logic
 * with a single `.resolve()` function that runs after all className-resolved
 * variant props are collected. It composes N-to-1 mappings like:
 *
 *   ring=2 + ringColor='blue' + ringInset=true → boxShadow: 'inset 0 0 0 2px blue'
 *
 * Because `.resolve()` runs once after ALL props are gathered, there's no
 * ordering issue — it sees the complete picture.
 */
/**
 * The resolver function passed to `.resolve()` on tailwind View/Text.
 * Receives merged props (original + className-resolved) and produces
 * composed style values.
 */
export declare function composedResolver(props: Record<string, any>, _env: any): Record<string, any> | null | undefined;
//# sourceMappingURL=composedResolver.d.ts.map