import { Collapsible } from '@tamagui/collapsible';
import { Stack } from '@tamagui/web';
import { H3 } from '@tamagui/text';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
declare function useAccordion(): {
    selected: string | string[];
    control: (value: string | string[]) => void;
};
declare const createAccordionScope: import("@tamagui/create-context").CreateScope;
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
interface AccordionHeaderProps extends PrimitiveHeading3Props {
}
type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>;
interface AccordionTriggerProps extends CollapsibleTriggerProps {
}
type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof Collapsible.Content>;
interface AccordionContentProps extends CollapsibleContentProps {
}
declare const Accordion: React.ForwardRefExoticComponent<(AccordionSingleProps | AccordionMultipleProps) & React.RefAttributes<React.Component<import("@tamagui/web").StackProps, {}, any>>> & {
    Trigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Header: React.ForwardRefExoticComponent<AccordionHeaderProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<AccordionContentProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
};
export { Accordion, createAccordionScope, useAccordion };
export type { AccordionContentProps, AccordionHeaderProps, AccordionItemProps, AccordionMultipleProps, AccordionSingleProps, AccordionTriggerProps, };
//# sourceMappingURL=Accordion.d.ts.map