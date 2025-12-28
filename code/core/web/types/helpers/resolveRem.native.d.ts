/**
 * Resolves rem values to pixel values on native platforms.
 * Uses PixelRatio.getFontScale() to account for user's font size preferences.
 *
 * @param value - A string value that may contain rem units (e.g., "1.5rem" or "calc(1rem + 2rem)")
 * @returns The numeric pixel value
 */
export declare function resolveRem(value: string): number;
/**
 * Checks if a value is a rem string
 */
export declare function isRemValue(value: unknown): value is string;
//# sourceMappingURL=resolveRem.native.d.ts.map