import * as React from 'react';
import type { SliderResponderProps } from './types';
/**
 * The slider is dragged through the responder system, and tamagui views stopped
 * carrying responder props on web. This is the same responder system
 * react-native-web runs, used directly, so dragging behaves as it did when this
 * was a react-native `View`.
 */
export declare const SliderResponder: ({ onResponderGrant, onResponderMove, onResponderRelease, children, }: SliderResponderProps) => React.JSX.Element;
//# sourceMappingURL=SliderResponder.d.ts.map