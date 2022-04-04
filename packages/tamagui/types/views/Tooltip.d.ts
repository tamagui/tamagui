/// <reference types="react" />
import { StackProps } from '@tamagui/core';
import { HoverablePopoverProps } from './HoverablePopover';
import { SizableTextProps } from './SizableText';
export declare type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
    size?: SizableTextProps['size'];
    contents?: string | any;
    tooltipFrameProps?: Omit<StackProps, 'children'>;
    tooltipContainerProps?: Omit<StackProps, 'children'>;
    alwaysDark?: boolean;
    showArrow?: boolean;
};
export declare const Tooltip: ({ size, contents, tooltipFrameProps, tooltipContainerProps, alwaysDark, showArrow, enterStyle, ...props }: TooltipProps) => JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map