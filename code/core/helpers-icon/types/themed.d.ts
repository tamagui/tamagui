import { type ResolveVariableAs } from '@tamagui/core';
import { SizableContext } from '@tamagui/sizable-context';
import type { FC } from 'react';
import type { IconProps } from './IconProps';
export { SizableContext };
type Options = {
    noClass?: boolean;
    defaultThemeColor?: string;
    defaultStrokeWidth?: number;
    fallbackColor?: string;
    resolveValues?: ResolveVariableAs;
};
export declare function themed(Component: FC<IconProps>, optsIn?: Options): {
    (propsIn: IconProps): import("react/jsx-runtime").JSX.Element;
    staticConfig: {
        isHOC: boolean;
        acceptsClassName: boolean;
    };
};
//# sourceMappingURL=themed.d.ts.map