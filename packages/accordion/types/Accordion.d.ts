import { Collapsible } from '@tamagui/collapsible';
import { Stack } from '@tamagui/core';
import * as React from 'react';
import { H3 } from 'tamagui';
type Direction = 'ltr' | 'rtl';
declare const createAccordionScope: import("tamagui").CreateScope;
interface AccordionSingleProps extends AccordionImplSingleProps {
    type: 'single';
}
interface AccordionMultipleProps extends AccordionImplMultipleProps {
    type: 'multiple';
}
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
/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */
declare const AccordionItem: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<typeof H3>;
interface AccordionHeaderProps extends PrimitiveHeading3Props {
}
/**
 * `AccordionHeader` contains the content for the parts of an `AccordionItem` that will be visible
 * whether or not its content is collapsed.
 */
declare const AccordionHeader: React.ForwardRefExoticComponent<AccordionHeaderProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>;
interface AccordionTriggerProps extends CollapsibleTriggerProps {
}
/**
 * `AccordionTrigger` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
declare const AccordionTrigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof Collapsible.Content>;
interface AccordionContentProps extends CollapsibleContentProps {
}
/**
 * `AccordionContent` contains the collapsible content for an `AccordionItem`.
 */
declare const AccordionContent: React.ForwardRefExoticComponent<AccordionContentProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
declare const Accordion: React.ForwardRefExoticComponent<(AccordionSingleProps | AccordionMultipleProps) & React.RefAttributes<import("react-native").View>> & {
    Trigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
    Header: React.ForwardRefExoticComponent<AccordionHeaderProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<AccordionContentProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
    Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<import("tamagui").TamaguiElement>>;
};
export { Accordion, createAccordionScope, AccordionItem, AccordionTrigger, AccordionHeader, AccordionContent, };
export type { AccordionSingleProps, AccordionMultipleProps, AccordionItemProps, AccordionHeaderProps, AccordionTriggerProps, AccordionContentProps, };
//# sourceMappingURL=Accordion.d.ts.map