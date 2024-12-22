import { type ResolveVariableAs } from '@tamagui/core';
import React from 'react';
import type { IconProps } from './IconProps';
type Options = {
    noClass?: boolean;
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
    resolveValues?: ResolveVariableAs;
};
export declare function themed(Component: React.FC<IconProps>, optsIn?: Options): (propsIn: IconProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=themed.d.ts.map