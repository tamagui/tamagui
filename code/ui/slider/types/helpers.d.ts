export declare function getNextSortedValues(prevValues: number[] | undefined, nextValue: number, atIndex: number): number[];
export declare function convertValueToPercentage(value: number, min: number, max: number): number;
/**
 * Returns a label for each thumb when there are two or more thumbs
 */
export declare function getLabel(index: number, totalValues: number): string | undefined;
/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
export declare function getClosestValueIndex(values: number[], nextValue: number): number;
/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
export declare function getThumbInBoundsOffset(width: number, left: number, direction: number): number;
/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export declare function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number): boolean;
export declare function linearScale(input: readonly [number, number], output: readonly [number, number]): (value: number) => number;
export declare function getDecimalCount(value: number): number;
export declare function roundValue(value: number, decimalCount: number): number;
//# sourceMappingURL=helpers.d.ts.map