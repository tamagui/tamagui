import { Collapsible } from '@tamagui/collapsible';
import { H3 } from '@tamagui/text';
import { GetProps, Stack, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeAccordion?: string;
};
type AccordionElement = AccordionImplMultipleElement | AccordionImplSingleElement;
interface AccordionSingleProps extends AccordionImplSingleProps {
    type: 'single';
}
interface AccordionMultipleProps extends AccordionImplMultipleProps {
    type: 'multiple';
}
type AccordionImplSingleElement = AccordionImplElement;
interface AccordionImplSingleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion item whose content is expanded.
     */
    value?: string;
    /**
     * The value of the item whose content is expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string): void;
    /**
     * Whether an accordion item can be collapsed after it has been opened.
     * @default false
     */
    collapsible?: boolean;
}
type AccordionImplMultipleElement = AccordionImplElement;
interface AccordionImplMultipleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion items whose contents are expanded.
     */
    value?: string[];
    /**
     * The value of the items whose contents are expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string[]): void;
}
type AccordionImplElement = TamaguiElement;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface AccordionImplProps extends PrimitiveDivProps {
    /**
     * Whether or not an accordion is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * The layout in which the Accordion operates.
     * @default vertical
     */
    orientation?: React.AriaAttributes['aria-orientation'];
    /**
     * The language read direction.
     */
    dir?: Direction;
    /**
     *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
     * @param selected - The values of the accordion items whose contents are expanded.
     */
    control?(selected: string[]): void;
}
type CollapsibleProps = React.ComponentPropsWithoutRef<typeof Collapsible>;
interface AccordionItemProps extends Omit<CollapsibleProps, 'open' | 'defaultOpen' | 'onOpenChange'> {
    /**
     * Whether or not an accordion item is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * A string value for the accordion item. All items within an accordion should use a unique value.
     */
    value: string;
}
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<typeof H3>;
type AccordionHeaderProps = PrimitiveHeading3Props;
declare const AccordionTriggerFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
} & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
}>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/web").StackPropsBase, {
    unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>;
    __variantProps: {};
}>;
type AccordionTriggerProps = GetProps<typeof AccordionTriggerFrame>;
declare const AccordionContentFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
} & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
}>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
    unstyled?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/web").StackPropsBase, {
    unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>;
    __variantProps: {};
}>;
type AccordionContentProps = GetProps<typeof AccordionContentFrame>;
declare const Accordion: React.ForwardRefExoticComponent<ScopedProps<AccordionSingleProps | AccordionMultipleProps> & React.RefAttributes<AccordionElement>> & {
    Trigger: import("@tamagui/web").TamaguiComponent<Object & Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    }>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    }>>, TamaguiElement, import("@tamagui/web").StackPropsBase, {
        unstyled?: boolean | undefined;
    }, {
        displayName: string | undefined;
        __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>;
        __variantProps: {};
    }>;
    Header: React.ForwardRefExoticComponent<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & React.RefAttributes<import("@tamagui/web").TamaguiTextElement>, "ref"> & React.RefAttributes<import("@tamagui/web").TamaguiTextElement>>;
    Content: import("@tamagui/web").TamaguiComponent<Object & Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    }>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & {
        unstyled?: boolean | undefined;
    }>>, TamaguiElement, import("@tamagui/web").StackPropsBase, {
        unstyled?: boolean | undefined;
    }, {
        displayName: string | undefined;
        __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>;
        __variantProps: {};
    }>;
    Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<TamaguiElement>>;
};
export { Accordion };
export type { AccordionContentProps, AccordionHeaderProps, AccordionItemProps, AccordionMultipleProps, AccordionSingleProps, AccordionTriggerProps, };
//# sourceMappingURL=Accordion.d.ts.map