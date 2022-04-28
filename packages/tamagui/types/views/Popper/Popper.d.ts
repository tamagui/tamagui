import React from 'react';
import { IPopperProps } from './types';
export declare const Popper: {
    ({ children, triggerRef, onClose, setOverlayRef, }: IPopperProps & {
        triggerRef: any;
        onClose: any;
        setOverlayRef?: ((overlayRef: any) => void) | undefined;
    }): JSX.Element;
    Content: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
    Arrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>> & import("@tamagui/core/types").MediaProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>>> & {
        placement?: import("./types").IPlacement | undefined;
    } & React.RefAttributes<unknown>>>;
};
export declare const PopperContent: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
//# sourceMappingURL=Popper.d.ts.map