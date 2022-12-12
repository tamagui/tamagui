import { ColorTokens, ThemeTokens } from '@tamagui/core';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
import { LinearGradientProps as ExpoLinearGradientProps } from '../lib/linear-gradient';
export type LinearGradientProps = Omit<ExpoLinearGradientProps, 'colors'> & Omit<YStackProps, 'children' | keyof ExpoLinearGradientProps> & {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
};
export declare const LinearGradient: React.ForwardRefExoticComponent<LinearGradientProps & React.RefAttributes<HTMLElement | View>>;
//# sourceMappingURL=LinearGradient.d.ts.map