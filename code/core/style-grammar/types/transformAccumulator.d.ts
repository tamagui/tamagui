export type TransformAccumulator = any[];
export declare function createTransformAccumulator(): TransformAccumulator;
export declare function cloneTransformAccumulator(source: TransformAccumulator): TransformAccumulator;
export declare function addTransformValue(accumulator: TransformAccumulator, key: string, value: any): void;
export declare function removeTransformValue(accumulator: TransformAccumulator | undefined, key: string): void;
export declare function getTransformPartKeys(accumulator: TransformAccumulator): string[];
export declare function finalizeTransformAccumulator(accumulator: TransformAccumulator): any;

//# sourceMappingURL=transformAccumulator.d.ts.map