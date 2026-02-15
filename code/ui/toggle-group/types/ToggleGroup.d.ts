import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, TamaguiElement } from '@tamagui/web';
import React from 'react';
import { ToggleFrame } from './Toggle';
type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & {
    value: string;
    id?: string;
    disabled?: boolean;
};
type ScopedProps<P> = P & {
    __scopeToggleGroup?: string;
};
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
    type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
    type: 'multiple';
}
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
declare const ToggleGroup: React.ForwardRefExoticComponent<ScopedProps<ToggleGroupProps> & React.RefAttributes<TamaguiElement>> & {
    Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "render" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | keyof import("@tamagui/web").StackStyleBase | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "activeStyle" | "value" | "defaultActiveStyle" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "__scopeToggleGroup"> & Omit<import("@tamagui/web").StackNonStyleProps, "unstyled" | keyof import("@tamagui/web").StackStyleBase | "size" | "activeStyle" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
    } & {
        __scopeToggleGroup?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/web").StackNonStyleProps, "unstyled" | keyof import("@tamagui/web").StackStyleBase | "size" | "activeStyle" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
    } & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        unstyled?: boolean | undefined;
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        defaultActiveStyle?: boolean | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
};
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
    /** The controlled stateful value of the item that is pressed. */
    value?: string;
    /** The value of the item that is pressed when initially rendered. */
    defaultValue?: string;
    /** The callback that fires when the value of the toggle group changes. */
    onValueChange?(value: string): void;
    /** Won't let the user turn the active item off. */
    disableDeactivation?: boolean;
}
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
    /** The controlled stateful value of the items that are pressed. */
    value?: string[];
    /** The value of the items that are pressed when initially rendered. */
    defaultValue?: string[];
    /** The callback that fires when the state of the toggle group changes. */
    onValueChange?(value: string[]): void;
    disableDeactivation?: never;
}
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
declare const ToggleGroupFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
type ToggleGroupImplProps = GetProps<typeof ToggleGroupFrame> & {
    orientation?: 'horizontal' | 'vertical';
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
    color?: string;
};
export { ToggleGroup };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps, };
//# sourceMappingURL=ToggleGroup.d.ts.map