import { SizableStackProps, YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
import { SliderImplElement, SliderProps, SliderTrackProps } from './types';
declare type SliderHorizontalElement = SliderImplElement;
declare type SliderVerticalElement = SliderImplElement;
declare type SliderTrackElement = HTMLElement | View;
declare const SliderTrack: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
declare type SliderTrackActiveElement = HTMLElement | View;
interface SliderTrackActiveProps extends YStackProps {
}
declare const SliderTrackActive: React.ForwardRefExoticComponent<SliderTrackActiveProps & React.RefAttributes<SliderTrackActiveElement>>;
declare type SliderThumbElement = HTMLElement | View;
interface SliderThumbProps extends SizableStackProps {
    index: number;
}
declare const SliderThumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
declare type SliderElement = SliderHorizontalElement | SliderVerticalElement;
declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<SliderElement>> & {
    Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
    TrackActive: React.ForwardRefExoticComponent<SliderTrackActiveProps & React.RefAttributes<SliderTrackActiveElement>>;
    Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
};
declare const Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<SliderTrackElement>>;
declare const Range: React.ForwardRefExoticComponent<SliderTrackActiveProps & React.RefAttributes<SliderTrackActiveElement>>;
declare const Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<SliderThumbElement>>;
export { Slider, SliderTrack, SliderTrackActive, SliderThumb, Track, Range, Thumb, };
export type { SliderProps, SliderTrackProps, SliderTrackActiveProps, SliderThumbProps };
//# sourceMappingURL=Slider.d.ts.map