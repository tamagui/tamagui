/**
 * Resolves rem values to pixel values on native platforms.
 * Uses PixelRatio.getFontScale() for layout props (margin, padding, radius).
 * For fontSize, leaves OS scaling to React Native Text component to avoid double-scaling.
 *
 * @param value - A string value containing rem units (e.g. "1.5rem")
 * @param isFontSize - Whether the target property is fontSize
 * @returns The numeric pixel value
 */
export declare function resolveRem(value: string, isFontSize?: boolean): number;
/**
 * Checks if a value is a strict rem string (e.g. "1.5rem", "-0.5rem")
 */
export declare function isRemValue(value: unknown): value is string;
//# sourceMappingURL=resolveRem.native.d.ts.map