import type { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/web';
import React from 'react';
import { ToggleFrame } from './Toggle';
import type { ToggleStylesBase } from './types';
type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & {
    value: string;
    id?: string;
    disabled?: boolean;
    size?: SizeTokens;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
    activeStyle?: ToggleStylesBase | null;
    color?: string;
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
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>, "color" | "size" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | "activeStyle" | "unstyled" | "defaultActiveStyle" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "value" | "disablePassStyles" | "__scopeToggleGroup"> & Omit<import("@tamagui/web").StackNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase | "activeStyle" | "unstyled" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
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
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
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
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
        size?: SizeTokens;
        /**
         * Used to disable passing styles down to children.
         */
        disablePassStyles?: boolean;
        activeStyle?: ToggleStylesBase | null;
        color?: string;
    } & {
        __scopeToggleGroup?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/web").StackNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase | "activeStyle" | "unstyled" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
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
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
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
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
        size?: SizeTokens;
        /**
         * Used to disable passing styles down to children.
         */
        disablePassStyles?: boolean;
        activeStyle?: ToggleStylesBase | null;
        color?: string;
    } & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
};
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the item that is pressed.
     */
    value?: string;
    /**
     * The value of the item that is pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the value of the toggle group changes.
     */
    onValueChange?(value: string): void;
    /**
     * Won't let the user turn the active item off.
     */
    disableDeactivation?: boolean;
}
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the items that are pressed.
     */
    value?: string[];
    /**
     * The value of the items that are pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the toggle group changes.
     */
    onValueChange?(value: string[]): void;
    disableDeactivation?: never;
}
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
declare const ToggleGroupImplElementFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/group").GroupExtraProps & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, import("@tamagui/web").StackStyleBase, {
    size?: any;
    elevation?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
type ToggleGroupImplProps = GetProps<typeof ToggleGroupImplElementFrame> & GroupProps & {
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
    sizeAdjust?: number;
    activeStyle?: ToggleStylesBase | null;
    color?: string;
};
export { ToggleGroup };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps, };
//# sourceMappingURL=ToggleGroup.d.ts.map