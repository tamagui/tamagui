import { ColorTokens } from '@tamagui/core';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { LinearGradientProps } from '../lib/linear-gradient';
declare type Props = Omit<LinearGradientProps, 'colors'> & Omit<YStackProps, 'children' | keyof LinearGradientProps> & {
    colors?: (ColorTokens | string)[];
};
export declare const LinearGradient: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
export {};
//# sourceMappingURL=LinearGradient.d.ts.map