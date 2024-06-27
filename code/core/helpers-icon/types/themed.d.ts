import React from 'react';
import type { IconProps } from './IconProps';
type ThemedOptions = {
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
};
type Opts = ThemedOptions & {
    noClassNames?: boolean;
};
export declare function themed(Component: React.FC<IconProps>, opts?: Opts): (propsIn: IconProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=themed.d.ts.map