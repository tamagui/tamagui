export declare type DisplayMetrics = {
    fontScale: number;
    height: number;
    scale: number;
    width: number;
};
declare type DimensionsValue = {
    window: DisplayMetrics;
    screen: DisplayMetrics;
};
declare type DimensionKey = 'window' | 'screen';
declare type DimensionEventListenerType = 'change';
export default class Dimensions {
    static get(dimension: DimensionKey): DisplayMetrics;
    static set(initialDimensions: DimensionsValue | null): void;
    static _update(): void;
    static addEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): {
        remove: () => void;
    };
    static removeEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): void;
}
export {};
//# sourceMappingURL=index.d.ts.map