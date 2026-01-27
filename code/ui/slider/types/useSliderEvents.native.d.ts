/**
 * Native-specific slider event handling using responder system
 */
import type { GestureReponderEvent } from '@tamagui/core';
import * as React from 'react';
import type { SliderContextValue } from './types';
export interface SliderEventHandlers {
    onSlideStart: (event: GestureReponderEvent, target: 'thumb' | 'track') => void;
    onSlideMove: (event: GestureReponderEvent) => void;
    onSlideEnd: (event: GestureReponderEvent) => void;
}
export interface UseSliderEventsResult {
    /** props to spread on the slider frame element */
    frameProps: Record<string, any>;
    /** wrapper component for native */
    Wrapper: React.ComponentType<{
        children: React.ReactNode;
        style?: any;
    }> | null;
}
export declare function useSliderEvents(context: SliderContextValue, handlers: SliderEventHandlers): UseSliderEventsResult;
//# sourceMappingURL=useSliderEvents.native.d.ts.map