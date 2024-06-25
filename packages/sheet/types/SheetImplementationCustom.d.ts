import { View } from 'react-native';
import type { SnapPointsMode } from './types';
export declare const SheetImplementationCustom: (props: Omit<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
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
    containerComponent?: import("react").ComponentType<any>;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & import("react").RefAttributes<View>, "theme" | "themeInverse"> & import("@tamagui/core").ThemeableProps) => import("react").ReactNode;
//# sourceMappingURL=SheetImplementationCustom.d.ts.map