import { ColorTokens } from '@tamagui/core';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
import { LinearGradientProps as ExpoLinearGradientProps } from '../lib/linear-gradient';
export declare type LinearGradientProps = Omit<ExpoLinearGradientProps, 'colors'> & Omit<YStackProps, 'children' | keyof ExpoLinearGradientProps> & {
    colors?: (ColorTokens | string)[];
};
export declare const LinearGradient: React.ForwardRefExoticComponent<LinearGradientProps & React.RefAttributes<HTMLElement | View>>;
//# sourceMappingURL=LinearGradient.d.ts.map