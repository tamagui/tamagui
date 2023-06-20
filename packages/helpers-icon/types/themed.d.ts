import React from 'react';
import { IconProps } from './IconProps';
type ThemedOptions = {
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
};
export declare function themed(Component: React.FC<IconProps>, opts?: ThemedOptions): (propsIn: IconProps) => JSX.Element;
export {};
//# sourceMappingURL=themed.d.ts.map