import { Collapsible } from '@tamagui/collapsible';
import type { GetProps, TamaguiElement } from '@tamagui/core';
import { View } from '@tamagui/core';
import { H1 } from '@tamagui/text';
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
type PrimitiveDivProps = GetProps<typeof View>;
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
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<typeof H1>;
type AccordionHeaderProps = PrimitiveHeading3Props;
declare const AccordionTriggerFrame: React.FunctionComponent<Omit<Omit<import("@tamagui/core").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    __scopeCollapsible?: string;
}, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    __scopeCollapsible?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        __scopeCollapsible?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic];
};
type AccordionTriggerProps = GetProps<typeof AccordionTriggerFrame>;
declare const AccordionContentFrame: React.FunctionComponent<Omit<Omit<import("@tamagui/core").StackNonStyleProps, keyof import("@tamagui/collapsible").CollapsibleContentProps> & import("@tamagui/collapsible").CollapsibleContentProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{}, keyof import("@tamagui/collapsible").CollapsibleContentProps>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/collapsible").CollapsibleContentProps> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, keyof import("@tamagui/collapsible").CollapsibleContentProps> & import("@tamagui/collapsible").CollapsibleContentProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/collapsible").CollapsibleContentProps>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, keyof import("@tamagui/collapsible").CollapsibleContentProps> & import("@tamagui/collapsible").CollapsibleContentProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/collapsible").CollapsibleContentProps>, import("@tamagui/core").StaticConfigPublic];
};
type AccordionContentProps = GetProps<typeof AccordionContentFrame>;
declare const Accordion: ((props: ScopedProps<AccordionMultipleProps | AccordionSingleProps> & import("@tamagui/compose-refs").RefProp<AccordionElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        __scopeCollapsible?: string;
    }, "__scopeAccordion" | "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        __scopeCollapsible?: string;
    }, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & {
        __scopeAccordion?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, "__scopeAccordion" | "__scopeCollapsible" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Header: import("@tamagui/compose-refs").RefComponent<import("@tamagui/core").TamaguiTextElement, Omit<Omit<import("@tamagui/core").TextNonStyleProps, "size" | "unstyled"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").TextStylePropsBase, "size" | "unstyled">> & import("@tamagui/core").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>, keyof import("@tamagui/core").TextNonStyleProps> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }, "ref">>;
    Content: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").StackNonStyleProps, keyof import("@tamagui/collapsible").CollapsibleContentProps> & import("@tamagui/collapsible").CollapsibleContentProps, "__scopeAccordion" | keyof import("@tamagui/collapsible").CollapsibleContentProps> & Omit<Omit<import("@tamagui/core").StackNonStyleProps, keyof import("@tamagui/collapsible").CollapsibleContentProps> & import("@tamagui/collapsible").CollapsibleContentProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{}, keyof import("@tamagui/collapsible").CollapsibleContentProps>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/collapsible").CollapsibleContentProps> & {
        __scopeAccordion?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<Omit<{}, keyof import("@tamagui/collapsible").CollapsibleContentProps>, "__scopeAccordion" | keyof import("@tamagui/collapsible").CollapsibleContentProps>, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/compose-refs").RefComponent<import("@tamagui/react-native-types/src").LegacyView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), AccordionItemProps>;
    HeightAnimator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, {}>;
};
export { Accordion };
export type { AccordionContentProps, AccordionHeaderProps, AccordionItemProps, AccordionMultipleProps, AccordionSingleProps, AccordionTriggerProps, };
//# sourceMappingURL=Accordion.d.ts.map