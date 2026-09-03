/**
 * Composed resolver for variant-driven Tailwind utilities.
 *
 * This replaces the imperative compose.ts ring/gradient/filter/shadow/transform
 * logic with a single, pure, declarative resolver function that runs after
 * all className-resolved variant props are collected.
 *
 * It composes N-to-1 mappings:
 *   - ring + inset-ring + inset-shadow + shadow → boxShadow
 *   - bg-linear-to-* + from/via/to → backgroundImage
 *   - blur + brightness + contrast + ... + drop-shadow → filter
 *   - perspective + rotateX/Y/Z + skewX/Y → transform
 *   - text-shadow presets + colors → textShadow*
 *
 * Supports both scalar values and conditional modifier objects ({ default, hover, ... }).
 */
export declare function composedResolver(props: Record<string, any>, _env?: any): Record<string, any> | null | undefined;
//# sourceMappingURL=composedResolver.d.ts.map