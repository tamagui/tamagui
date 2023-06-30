import React from 'react';
import { SvgProps } from 'react-native-svg';
import { IconProps } from './IconProps';
type ThemedOptions = {
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
};
export declare function themed(Component: React.FC<SvgProps>, opts?: ThemedOptions): (propsIn: IconProps) => JSX.Element;
export {};
//# sourceMappingURL=themed.d.ts.map