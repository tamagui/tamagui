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
declare const ToggleGroup: ((props: ScopedProps<ToggleGroupProps> & import("@tamagui/compose-refs").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }, {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "__scopeToggleGroup" | "active" | "activeStyle" | "color" | "defaultActiveStyle" | "size" | "value" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }> & {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }>>>> & Omit<import("@tamagui/web").StackNonStyleProps, "active" | "activeStyle" | "color" | "defaultActiveStyle" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }> & {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }> & {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }, {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
    } & {
        __scopeToggleGroup?: string;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/web").StackNonStyleProps, "active" | "activeStyle" | "color" | "defaultActiveStyle" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }> & {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }> & {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }, {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
    } & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: 'style';
            };
        }>> | undefined;
    }, {
        active?: boolean | undefined;
        color?: string | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    }, {
        accept: {
            readonly activeStyle: 'style';
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
declare const ToggleGroupFrame: React.FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
};
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