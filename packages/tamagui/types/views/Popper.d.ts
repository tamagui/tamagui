import { StackProps } from '@tamagui/core';
import type { ReactElement, RefObject } from 'react';
import React from 'react';
import { View } from 'react-native';
export declare type IPopoverArrowProps = {
    height?: any;
    width?: any;
    children?: any;
    color?: any;
    style?: any;
};
export declare type IPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right top' | 'right bottom' | 'left top' | 'left bottom';
export declare type IPopperProps = {
    shouldFlip?: boolean;
    crossOffset?: number;
    offset?: number;
    children: React.ReactNode;
    shouldOverlapWithTrigger?: boolean;
    trigger?: ReactElement | RefObject<any>;
    placement?: IPlacement;
};
export declare type IArrowStyles = {
    placement?: string;
    height?: number;
    width?: number;
};
export declare type IScrollContentStyle = {
    placement?: string;
    arrowHeight: number;
    arrowWidth: number;
};
export declare const Popper: {
    (props: IPopperProps & {
        triggerRef: any;
        onClose: any;
        setOverlayRef?: ((overlayRef: any) => void) | undefined;
    }): JSX.Element;
    Content: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
    Arrow: React.ForwardRefExoticComponent<Pick<Omit<import("@tamagui/core").RNWInternalProps, "children"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {} & {
        hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {}) | null | undefined;
        pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {}) | null | undefined;
    } & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {} & {
        hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {}) | null | undefined;
        pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & {}) | null | undefined;
    }> & {
        className?: string | undefined;
        tag?: string | undefined;
        animated?: boolean | undefined;
        onHoverIn?: ((e: MouseEvent) => any) | undefined;
        onHoverOut?: ((e: MouseEvent) => any) | undefined;
        onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        space?: string | number | boolean | import("@tamagui/core").Variable | undefined;
        pointerEvents?: string | undefined;
    } & {
        ref?: RefObject<HTMLElement | View> | ((node: HTMLElement | View) => any) | undefined;
        children?: any;
    }, "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "zIndex" | "left" | "right" | "children" | "accessibilityState" | "accessibilityValue" | "focusable" | "nativeID" | "onBlur" | "onClick" | "onClickCapture" | "onContextMenu" | "onFocus" | "onKeyDown" | "onKeyUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "pointerEvents" | "testID" | "dataSet" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onMouseUp" | "onScroll" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "href" | "hrefAttrs" | `$${string}` | "display" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "cursor" | "contain" | "space" | "hoverStyle" | "pressStyle" | "className" | "tag" | "animated" | "onHoverIn" | "onHoverOut" | "onPress" | "onPressIn" | "onPressOut"> & React.RefAttributes<unknown>>;
};
export declare type PopperArrowProps = StackProps;
//# sourceMappingURL=Popper.d.ts.map