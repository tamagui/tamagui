/**
 * Native ToastItem — uses Reanimated for 60fps stacking/gesture animations.
 *
 * Key patterns (proven in ToastReanimatedTest):
 * 1. Two-layer AnimatedView: outer (entering/exiting) + inner (useAnimatedStyle stacking)
 * 2. React.memo with custom comparator: only re-render on id/index change
 * 3. All gesture callbacks are worklets (no .runOnJS(true))
 * 4. Heights measured via SharedValue.modify() in onLayout worklet
 * 5. No per-item React state — only useSharedValue for gesture
 */
import * as React from 'react';
import { type SharedValue } from 'react-native-reanimated';
import type { ToastT } from './ToastState';
export interface NativeToastItemProps {
    toast: ToastT;
    index: number;
    expanded: boolean;
    gap: number;
    total: SharedValue<number>;
    heights: SharedValue<Record<string, number>>;
    toastOrder: SharedValue<string[]>;
    hide: (id: string) => void;
    onTap?: () => void;
    placement: 'top' | 'bottom';
    maxVisibleToasts: number;
    reducedMotion?: boolean;
    /** true only when this toast was just created (not revealed by dismissing another) */
    isNew?: boolean;
    children: React.ReactNode;
    testID?: string;
}
export declare const NativeToastItem: React.NamedExoticComponent<NativeToastItemProps>;
//# sourceMappingURL=NativeToastItem.native.d.ts.map