import React from 'react';
import { IPopoverProps } from './Popover/types';
export declare type HoverablePopoverHandle = {
    close: () => void;
};
export declare type HoverablePopoverProps = IPopoverProps & {
    delay?: number;
    fallbackToPress?: boolean;
    allowHoverOnContent?: boolean;
    disableUntilSettled?: boolean;
};
export declare const HoverablePopover: React.ForwardRefExoticComponent<IPopoverProps & {
    delay?: number | undefined;
    fallbackToPress?: boolean | undefined;
    allowHoverOnContent?: boolean | undefined;
    disableUntilSettled?: boolean | undefined;
} & React.RefAttributes<HoverablePopoverHandle>> & {
    Arrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
        placement?: import("./Popper/types").IPlacement | undefined;
    } & React.RefAttributes<unknown>>>;
};
//# sourceMappingURL=HoverablePopover.d.ts.map