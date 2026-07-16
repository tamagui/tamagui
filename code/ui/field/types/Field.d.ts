import type { GetProps } from '@tamagui/core';
import * as React from 'react';
import { useFieldControl, useFieldState } from './FieldContext';
import type { FieldState, FieldValidationMode, FieldValidator, FieldValidityState } from './types';
export declare const FieldFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldLabelFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldDescriptionFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldErrorFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const FieldItemFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
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
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps & {
    ref?: React.Ref<(HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & FieldExtraProps, import("@tamagui/core").StackStyleBase, {
    valid?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    dirty?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>, keyof FieldExtraProps> & FieldExtraProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & FieldExtraProps, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Label: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>, "theme" | "debug" | "onBlur" | "onChange" | "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | "style" | "children" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").TextStylePropsBase | "render" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "onTextLayout" | "elevationAndroid" | "dir" | "onFocus" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>>, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>>, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>, "theme" | "debug" | "onBlur" | "onChange" | "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | "style" | "children" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").TextStylePropsBase | "render" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "onTextLayout" | "elevationAndroid" | "dir" | "onFocus" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>>, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>>, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Error: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>, "theme" | "debug" | "onBlur" | "onChange" | "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | "style" | "children" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | "match" | keyof import("@tamagui/core").TextStylePropsBase | "render" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "onTextLayout" | "elevationAndroid" | "dir" | "onFocus" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>>> & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & {
        match?: boolean | keyof FieldValidityState;
    }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/core").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & {
        match?: boolean | keyof FieldValidityState;
    }, import("@tamagui/core").TextStylePropsBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>, "theme" | "debug" | "onBlur" | "onChange" | "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | "style" | "children" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | "render" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & {
        disabled?: boolean;
    }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "valid" | "invalid" | "touched" | "dirty" | "filled" | "focused" | "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & {
        disabled?: boolean;
    }, import("@tamagui/core").StackStyleBase, {
        valid?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        dirty?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        disabled?: boolean | undefined;
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