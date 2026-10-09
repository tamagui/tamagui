/**
 * Adapted from expo-linear-gradient
 * https://github.com/expo/expo/blob/main/packages/expo-linear-gradient/src/LinearGradient.web.tsx
 *
 * MIT License
 * Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)
 */
import { View } from '@tamagui/core';
import * as React from 'react';
type NativeLinearGradientPoint = [x: number, y: number];
export type LinearGradientPoint = {
    x: number;
    y: number;
} | NativeLinearGradientPoint;
export type LinearGradientProps = Omit<React.ComponentProps<typeof View>, 'start' | 'end'> & {
    colors: readonly string[];
    locations?: readonly number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};
export declare function LinearGradient({ colors, locations, start, end, ...props }: LinearGradientProps): React.JSX.Element;
export {};
//# sourceMappingURL=linear-gradient.d.ts.map