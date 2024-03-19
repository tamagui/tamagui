import type { SizableStackProps } from '@tamagui/stacks';
import * as React from 'react';
import type { TooltipProps } from './Tooltip';
export type TooltipSimpleProps = TooltipProps & {
    disabled?: boolean;
    label?: React.ReactNode;
    children?: React.ReactNode;
    contentProps?: SizableStackProps;
};
export declare const TooltipSimple: React.FC<TooltipSimpleProps>;
//# sourceMappingURL=TooltipSimple.d.ts.map