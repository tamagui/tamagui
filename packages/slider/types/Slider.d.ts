import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
import { SliderImplElement, SliderProps } from './types';
declare type SliderHorizontalElement = SliderImplElement;
declare type SliderVerticalElement = SliderImplElement;
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
declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<SliderElement>> & {
    Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
    Range: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<SliderRangeElement>>;
    Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
};
declare const Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
declare const Range: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<SliderRangeElement>>;
declare const Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
export { Slider, SliderTrack, SliderRange, SliderThumb, Track, Range, Thumb, };
export type { SliderProps, SliderTrackProps, SliderRangeProps, SliderThumbProps };
//# sourceMappingURL=Slider.d.ts.map