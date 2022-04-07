import { LinearGradientProps } from '@tamagui/expo-linear-gradient';
import * as React from 'react';
import { StackProps } from './Stacks';
declare type Props = LinearGradientProps & Omit<StackProps, 'children' | keyof LinearGradientProps>;
export declare const LinearGradient: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
export {};
//# sourceMappingURL=LinearGradient.d.ts.map