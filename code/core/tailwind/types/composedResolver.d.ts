/**
 * Composes the N-to-1 Tailwind utilities into single style values.
 *
 * The class walk emits each part under a `__`-prefixed key and the frontend
 * descriptor's `compose` hook calls this once, with only those keys, right after
 * the walk. It is pure: same bag in, same styles out, no props and no env.
 *
 *   - ring + inset-ring + inset-shadow + shadow → boxShadow
 *   - bg-linear-to-* + from/via/to → backgroundImage
 *   - blur + brightness + contrast + … + drop-shadow → filter
 *   - perspective + rotateX/Y/Z + skewX/Y → transform
 *   - text-shadow presets + colors → textShadow*
 *
 * A part authored with modifiers (`hover:ring-4`) arrives as a condition object,
 * so every composed value is built once per condition the parts mention.
 */
export declare function composedResolver(props: Record<string, any>): Record<string, any> | null;
//# sourceMappingURL=composedResolver.d.ts.map