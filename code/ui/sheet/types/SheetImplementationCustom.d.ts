import React from 'react';
import { View } from 'react-native';
import type { SnapPointsMode } from './types';
export declare const SheetImplementationCustom: React.ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: React.ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    forceRemoveScrollEnabled?: boolean;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    animation?: import("@tamagui/core").AnimationProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & React.RefAttributes<View>>;
//# sourceMappingURL=SheetImplementationCustom.d.ts.map