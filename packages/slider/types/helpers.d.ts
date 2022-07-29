export declare function getNextSortedValues(prevValues: number[] | undefined, nextValue: number, atIndex: number): number[];
export declare function convertValueToPercentage(value: number, min: number, max: number): number;
export declare function getLabel(index: number, totalValues: number): string | undefined;
export declare function getClosestValueIndex(values: number[], nextValue: number): number;
export declare function getThumbInBoundsOffset(width: number, left: number, direction: number): number;
export declare function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number): boolean;
export declare function linearScale(input: readonly [number, number], output: readonly [number, number]): (value: number) => number;
export declare function getDecimalCount(value: number): number;
export declare function roundValue(value: number, decimalCount: number): number;
//# sourceMappingURL=helpers.d.ts.map