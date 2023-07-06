import { Collapsible } from '@tamagui/collapsible';
import type { Scope } from '@tamagui/create-context';
import { H3 } from '@tamagui/text';
import { Stack, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
declare function useAccordion(): {
    selected: string | string[];
    control: (value: string | string[]) => void;
};
declare const createAccordionScope: import("@tamagui/create-context").CreateScope;
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
type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>;
interface AccordionTriggerProps extends CollapsibleTriggerProps {
}
type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof Collapsible.Content>;
interface AccordionContentProps extends CollapsibleContentProps {
}
declare const Accordion: React.ForwardRefExoticComponent<(AccordionSingleProps | AccordionMultipleProps) & React.RefAttributes<AccordionElement>> & {
    Trigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<TamaguiElement>>;
    Header: React.ForwardRefExoticComponent<(Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "unstyled" | "size"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "unstyled" | "size"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "unstyled" | "size"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref"> | Omit<Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & React.RefAttributes<TamaguiElement>, "ref">, "ref">) & React.RefAttributes<TamaguiElement>>;
    Content: import("@tamagui/web").ReactComponentWithRef<AccordionContentProps & {
        __scopeAccordion?: Scope;
    } & Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, keyof AccordionContentProps | "__scopeAccordion">, TamaguiElement> & {
        staticConfig: import("@tamagui/web").StaticConfigParsed;
        styleable: import("@tamagui/web").Styleable<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>>, TamaguiElement>;
    };
    Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<React.Component<import("@tamagui/web").StackProps, {}, any>>>;
};
export { Accordion, createAccordionScope, useAccordion };
export type { AccordionContentProps, AccordionHeaderProps, AccordionItemProps, AccordionMultipleProps, AccordionSingleProps, AccordionTriggerProps, };
//# sourceMappingURL=Accordion.d.ts.map