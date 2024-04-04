/// <reference types="react" />
import { View } from 'react-native';
import type { SnapPointsMode } from './types';
export declare const SheetImplementationCustom: (props: Omit<{
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    onOpenChange?: (((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>) | undefined;
    position?: number | undefined;
    defaultPosition?: number | undefined;
    snapPoints?: (string | number)[] | undefined;
    snapPointsMode?: SnapPointsMode | undefined;
    onPositionChange?: import("./types").PositionChangeHandler | undefined;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean | undefined;
    dismissOnSnapToBottom?: boolean | undefined;
    forceRemoveScrollEnabled?: boolean | undefined;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy | undefined;
    unmountChildrenWhenHidden?: boolean | undefined;
    native?: boolean | "ios"[] | undefined;
    animation?: import("@tamagui/core").AnimationProp | undefined;
    handleDisableScroll?: boolean | undefined;
    disableDrag?: boolean | undefined;
    modal?: boolean | undefined;
    zIndex?: number | undefined;
    portalProps?: import("@tamagui/portal").PortalProps | undefined;
    moveOnKeyboardChange?: boolean | undefined;
    containerComponent?: import("react").ComponentType<any> | undefined;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & import("react").RefAttributes<View>, "theme" | "themeInverse"> & import("@tamagui/core").ThemeableProps) => import("react").ReactNode;
//# sourceMappingURL=SheetImplementationCustom.d.ts.map