import React from 'react';
import { IPopoverProps } from './Popover/types';
export declare type HoverablePopoverHandle = {
    close: () => void;
};
export declare type HoverablePopoverProps = IPopoverProps & {
    delay?: number;
    allowHoverOnContent?: boolean;
    disableUntilSettled?: boolean;
};
export declare const HoverablePopover: React.ForwardRefExoticComponent<IPopoverProps & {
    delay?: number | undefined;
    allowHoverOnContent?: boolean | undefined;
    disableUntilSettled?: boolean | undefined;
} & React.RefAttributes<HoverablePopoverHandle>>;
//# sourceMappingURL=HoverablePopover.d.ts.map