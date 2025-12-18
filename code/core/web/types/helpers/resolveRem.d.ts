/**
 * Resolves rem values on web platforms.
 * On web, browsers handle rem natively, so we just return the value as-is.
 *
 * @param value - A string value containing rem units
 * @returns The same string value (browsers handle rem natively)
 */
export declare function resolveRem(value: string): string;
/**
 * Checks if a value is a rem string
 */
export declare function isRemValue(value: unknown): value is string;
//# sourceMappingURL=resolveRem.d.ts.map