import type { TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { View } from 'react-native';
import type { SliderImplProps } from './types';
export declare const SliderFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SliderImpl: React.ForwardRefExoticComponent<SliderImplProps & React.RefAttributes<View>>;
//# sourceMappingURL=SliderImpl.d.ts.map