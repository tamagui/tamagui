/// <reference types="react" />
import { StackProps } from '@tamagui/core';
import { HoverablePopoverProps } from './HoverablePopover';
import { SizableTextProps } from './SizableText';
export declare type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
    size?: SizableTextProps['size'];
    contents?: string | any;
    tooltipFrameProps?: Omit<StackProps, 'children'>;
    alwaysDark?: boolean;
};
export declare const Tooltip: ({ size, contents, tooltipFrameProps, alwaysDark, ...props }: TooltipProps) => JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map