import type { GetProps } from '@tamagui/core';
import * as React from 'react';
import { useFieldControl, useFieldState } from './FieldContext';
import type { FieldState, FieldValidationMode, FieldValidator, FieldValidityState } from './types';
export declare const FieldFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldLabelFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldDescriptionFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldErrorFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldItemFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type FieldExtraProps = {
    name?: string;
    disabled?: boolean;
    invalid?: boolean;
    validate?: FieldValidator;
    validationMode?: FieldValidationMode;
    validationDebounceTime?: number;
};
export type FieldProps = Omit<GetProps<typeof FieldFrame>, keyof FieldExtraProps> & FieldExtraProps;
export type FieldLabelProps = GetProps<typeof FieldLabelFrame>;
export type FieldDescriptionProps = GetProps<typeof FieldDescriptionFrame>;
export type FieldErrorProps = GetProps<typeof FieldErrorFrame> & {
    match?: boolean | keyof FieldValidityState;
};
export type FieldItemProps = GetProps<typeof FieldItemFrame> & {
    disabled?: boolean;
};
export declare const Field: React.FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & FieldExtraProps, import("@tamagui/core").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, keyof FieldExtraProps> & FieldExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & FieldExtraProps, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Label: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "componentName" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "elevationAndroid" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "maxFontSizeMultiplier" | "minimumFontScale" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>>, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>>, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "componentName" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "elevationAndroid" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "maxFontSizeMultiplier" | "minimumFontScale" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>>, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>>, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Error: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "componentName" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "elevationAndroid" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "match" | "maxFontSizeMultiplier" | "minimumFontScale" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>> & {
        match?: boolean | keyof FieldValidityState;
    }, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>> & {
        match?: boolean | keyof FieldValidityState;
    }, import("@tamagui/core").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "componentName" | "dangerouslySetInnerHTML" | "debug" | "dirty" | "disableClassName" | "disableOptimization" | "disabled" | "download" | "elevationAndroid" | "filled" | "focused" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "touched" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "valid" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>> & {
        disabled?: boolean;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>> & {
        disabled?: boolean;
    }, import("@tamagui/core").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    useFieldState: typeof useFieldState;
    useFieldControl: typeof useFieldControl;
};
export declare namespace Field {
    type Props = FieldProps;
    type State = FieldState;
    type ValidityState = FieldValidityState;
}
export {};
//# sourceMappingURL=Field.d.ts.map