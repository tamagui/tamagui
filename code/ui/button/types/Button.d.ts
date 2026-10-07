import type { TextParentStyles } from '@tamagui/text';
import { textParentProps } from '@tamagui/text';
import type { GetProps, TamaguiComponentPropsBaseBase } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
export declare const ButtonFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "disabled"> & Omit<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, "disabled">> & import("@tamagui/web").WithFlatVariantValues<{
    disabled?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "name" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured"> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, never> & Omit<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").TextStylePropsBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>, keyof import("@tamagui/web").TextNonStyleProps> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export type ButtonIconProps = {
    children: ReactNode;
    color?: string;
    scaleIcon?: number;
    size?: number;
};
export declare const ButtonIcon: ({ children, color, scaleIcon, size }: ButtonIconProps) => any;
type ButtonIconInput = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | ((props: {
    color?: any;
    size?: any;
}) => ReactNode) | null;
/**
 * The props `useButton` reads and replaces. It hands the frame everything else
 * untouched, so this is exactly what its result omits.
 */
type ButtonConsumedProps = {
    children?: ReactNode;
    disabled?: boolean;
    render?: TamaguiComponentPropsBaseBase['render'];
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
    iconSize?: number;
    scaleIcon?: number;
};
/** passed straight through to the rendered `<button>` */
type ButtonHTMLProps = {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
};
export type ButtonBehaviorProps = TextParentStyles & ButtonConsumedProps & ButtonHTMLProps;
/**
 * What `useButton` returns: the caller's props minus the ones it consumed, plus
 * the ones it decides. Spelled out rather than cast, so a skin that spreads the
 * result onto a frame is type-checked on exactly what it will receive.
 */
export type UseButtonProps<Props> = Omit<Omit<Props, keyof TextParentStyles | keyof typeof textParentProps>, keyof ButtonConsumedProps> & {
    children: ReactNode;
    'aria-disabled'?: boolean;
    disabled?: boolean;
    render?: TamaguiComponentPropsBaseBase['render'];
    tabIndex?: number;
};
export type UseButtonOptions = {
    Text?: any;
    iconColor?: string;
    iconSize?: number;
    textProps?: Record<string, unknown>;
};
/**
 * Button behavior: icon theming, wrapping bare children in a text, and the html
 * nesting rules. Flat text styles are partitioned in one pass and handed to the
 * wrapped text, with no style resolution hook or text context.
 */
export declare function useButton<Props extends ButtonBehaviorProps>(propsIn: Props, { Text, iconColor, iconSize: iconSizeOption, textProps: textPropsOption, }?: UseButtonOptions): {
    isNested: boolean;
    props: UseButtonProps<Props>;
};
export type ButtonFrameProps = GetProps<typeof ButtonFrame>;
export {};
//# sourceMappingURL=Button.d.ts.map