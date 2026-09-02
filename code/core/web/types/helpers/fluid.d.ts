export interface FluidOptions {
    min: number;
    max: number;
    from?: number;
    to?: number;
    unit?: 'cqi' | 'cqw' | 'vw';
}
/**
 * Generates a CSS clamp() string implementing a linear fluid scale.
 * Symmetrically consumed by Web (CSS engine) and Native (Tamagui unit resolver).
 *
 * @example
 * fluid({ min: 18, max: 36, from: 375, to: 1200, unit: 'cqi' })
 * // => "clamp(18px, 2.1818cqi + 9.82px, 36px)"
 *
 * fluid(18, 36, { from: 375, to: 1200 })
 * // => "clamp(18px, 2.1818cqi + 9.82px, 36px)"
 */
export declare function fluid(options: FluidOptions): string;
export declare function fluid(min: number, max: number, options?: Omit<FluidOptions, 'min' | 'max'>): string;
//# sourceMappingURL=fluid.d.ts.map