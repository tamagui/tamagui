import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
declare type Direction = 'ltr' | 'rtl';
declare const createSliderScope: import("@tamagui/create-context").CreateScope;
declare type SliderOrientationPrivateProps = {
    min: number;
    max: number;
    onSlideStart?(value: number): void;
    onSlideMove?(value: number): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(step: {
        event: React.KeyboardEvent;
        direction: number;
    }): void;
};
interface SliderOrientationProps extends Omit<SliderImplProps, keyof SliderImplPrivateProps>, SliderOrientationPrivateProps {
}
declare type SliderHorizontalElement = SliderImplElement;
interface SliderHorizontalProps extends SliderOrientationProps {
    dir?: Direction;
}
declare type SliderVerticalElement = SliderImplElement;
interface SliderVerticalProps extends SliderOrientationProps {
}
declare type SliderImplElement = HTMLElement | View;
declare type SliderImplPrivateProps = {
    onSlideStart(event: React.PointerEvent): void;
    onSlideMove(event: React.PointerEvent): void;
    onSlideEnd(event: React.PointerEvent): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(event: React.KeyboardEvent): void;
};
interface SliderImplProps extends YStackProps, SliderImplPrivateProps {
    dir?: Direction;
}
declare type SliderTrackElement = HTMLElement | View;
interface SliderTrackProps extends YStackProps {
}
declare const SliderTrack: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
declare type SliderRangeElement = HTMLElement | View;
interface SliderRangeProps extends YStackProps {
}
declare const SliderRange: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<SliderRangeElement>>;
declare type SliderThumbElement = HTMLElement | View;
interface SliderThumbProps extends YStackProps {
    index: number;
}
declare const SliderThumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
declare type SliderElement = SliderHorizontalElement | SliderVerticalElement;
interface SliderProps extends Omit<SliderHorizontalProps | SliderVerticalProps, keyof SliderOrientationPrivateProps | 'defaultValue'> {
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
declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<SliderElement>> & {
    Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
    Range: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<SliderRangeElement>>;
    Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
};
declare const Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
declare const Range: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<SliderRangeElement>>;
declare const Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
export { createSliderScope, Slider, SliderTrack, SliderRange, SliderThumb, Track, Range, Thumb, };
export type { SliderProps, SliderTrackProps, SliderRangeProps, SliderThumbProps };
//# sourceMappingURL=Slider.d.ts.map