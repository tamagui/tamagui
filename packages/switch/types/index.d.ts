/// <reference types="react" />
export * from './Switch';
export * from './SwitchContext';
export * from './createSwitch';
export declare const Switch: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createSwitch").SwitchExtraProps, "space" | "zIndex" | "backgroundColor" | "borderRadius" | "pointerEvents" | "display" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "transformOrigin" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createSwitch").SwitchExtraProps, Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createSwitch").SwitchExtraProps, Omit<import("@tamagui/web").StackStyleBase, keyof import("./createSwitch").SwitchExtraProps>, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        checked?: boolean | undefined;
        frameWidth?: number | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, {}];
} & {
    Thumb: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, Omit<import("@tamagui/web").StackStyleBase, never>, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        checked?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, {}>;
};
//# sourceMappingURL=index.d.ts.map