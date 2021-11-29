/// <reference types="react" />
import { StackProps } from '@tamagui/core';
import { HoverablePopoverProps } from './HoverablePopover';
export declare type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
    contents?: string | any;
    tooltipFrameProps?: Omit<StackProps, 'children'>;
};
export declare const Tooltip: ({ contents, tooltipFrameProps, ...props }: TooltipProps) => JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map