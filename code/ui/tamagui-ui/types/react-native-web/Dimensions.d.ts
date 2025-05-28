export type DisplayMetrics = {
    fontScale: number;
    height: number;
    scale: number;
    width: number;
};
type DimensionsValue = {
    window: DisplayMetrics;
    screen: DisplayMetrics;
};
type DimensionKey = 'window' | 'screen';
type DimensionEventListenerType = 'change';
export declare const Dimensions: {
    get(dimension: DimensionKey): DisplayMetrics;
    set(initialDimensions: DimensionsValue | null): void;
    addEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): {
        remove: () => void;
    };
    removeEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): void;
};
export {};
//# sourceMappingURL=Dimensions.d.ts.map