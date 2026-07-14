import { type ResolveVariableAs } from '@tamagui/core';
import type { FC } from 'react';
import type { IconProps } from './IconProps';
type Options = {
    noClass?: boolean;
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
    resolveValues?: ResolveVariableAs;
};
export declare function reconstructIconStyleModeProps(props: IconProps, theme: any): IconProps;
export declare function themed(Component: FC<IconProps>, optsIn?: Options): {
    (propsIn: IconProps): import("react/jsx-runtime").JSX.Element;
    staticConfig: {
        isHOC: boolean;
        acceptsClassName: boolean;
    };
};
export {};
//# sourceMappingURL=themed.d.ts.map