import type { GestureReponderEvent, SizeTokens, TamaguiElement } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import type { SizableStackProps } from '@tamagui/stacks';
export type ScopedProps<P> = P & {
    __scopeSlider?: Scope;
};
export type Direction = 'ltr' | 'rtl';
type SliderEventProps = {
    onSlideStart?: (event: GestureReponderEvent, value: number, target: 'thumb' | 'track') => void;
    onSlideMove?: (event: GestureReponderEvent, value: number) => void;
    onSlideEnd?: (event: GestureReponderEvent, value: number) => void;
};
type SliderImplPrivateProps = {
    onSlideStart(event: GestureReponderEvent, target: 'thumb' | 'track'): void;
    onSlideMove(event: GestureReponderEvent): void;
    onSlideEnd(event: GestureReponderEvent): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(event: React.KeyboardEvent): void;
};
export type SliderTrackProps = SizableStackProps;
export interface SliderImplProps extends SliderTrackProps, SliderImplPrivateProps {
    dir?: Direction;
    orientation: 'horizontal' | 'vertical';
}
type SliderOrientationPrivateProps = {
    min: number;
    max: number;
    onSlideStart?(value: number, target: 'thumb' | 'track', event: GestureReponderEvent): void;
    onSlideMove?(value: number, event: GestureReponderEvent): void;
    onSlideEnd?(event: GestureReponderEvent, value: number): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(step: {
        event: React.KeyboardEvent;
        direction: number;
    }): void;
};
interface SliderOrientationProps extends Omit<SliderImplProps, keyof SliderImplPrivateProps | 'orientation'>, SliderOrientationPrivateProps {
}
export interface SliderHorizontalProps extends SliderOrientationProps {
    dir?: Direction;
}
export interface SliderVerticalProps extends SliderOrientationProps {
    dir?: Direction;
}
export interface SliderProps extends Omit<SliderHorizontalProps, keyof SliderOrientationPrivateProps | 'defaultValue'>, SliderEventProps {
    size?: SizeTokens;
    name?: string;
    disabled?: boolean;
    orientation?: React.AriaAttributes['aria-orientation'];
    dir?: Direction;
    min?: number;
    max?: number;
    step?: number;
    minStepsBetweenThumbs?: number;
    value?: number[];
    defaultValue?: number[];
    onValueChange?(value: number[]): void;
}
export type SliderContextValue = {
    size?: SizeTokens | number | null;
    disabled?: boolean;
    min: number;
    max: number;
    values: number[];
    valueIndexToChangeRef: React.MutableRefObject<number>;
    thumbs: Map<TamaguiElement, number>;
    orientation: SliderProps['orientation'];
};
export {};
//# sourceMappingURL=types.d.ts.map