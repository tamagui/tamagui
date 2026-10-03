/**
 * Native has no autoupdate, so the floating position is recomputed by hand
 * whenever the two things that invalidate it change: the window (orientation,
 * scale) and the soft keyboard.
 */
export declare const useRepositionOnNative: (update: () => void, passThrough: boolean | undefined) => void;
//# sourceMappingURL=useRepositionOnNative.native.d.ts.map