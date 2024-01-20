import { AnimatePresenceProps } from '@tamagui/animate-presence';
import { ThemeableStackProps } from '@tamagui/stacks';
import { GetProps, Stack, StackProps } from '@tamagui/web';
import * as React from 'react';
interface CollapsibleProps extends StackProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof Stack>;
declare const CollapsibleTriggerFrame: import("@tamagui/web").TamaguiComponent<{
    __tamaDefer: true;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase, void, {}>;
declare const CollapsibleTrigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase & void>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, import("@tamagui/web").StackStylePropsBase, void, {}>;
interface CollapsibleContentProps extends AnimatePresenceProps, ThemeableStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const CollapsibleContentFrame: import("@tamagui/web").TamaguiComponent<{
    __tamaDefer: true;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase, void, {}>;
declare const CollapsibleContent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase & void>, "__scopeCollapsible" | keyof CollapsibleContentProps> & CollapsibleContentProps & {
    __scopeCollapsible?: string | undefined;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentProps & {
    __scopeCollapsible?: string | undefined;
}, import("@tamagui/web").StackStylePropsBase, void, {}>;
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: string | undefined;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement>> & {
    Trigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase & void>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, import("@tamagui/web").StackStylePropsBase, void, {}>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStylePropsBase & void>, "__scopeCollapsible" | keyof CollapsibleContentProps> & CollapsibleContentProps & {
        __scopeCollapsible?: string | undefined;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentProps & {
        __scopeCollapsible?: string | undefined;
    }, import("@tamagui/web").StackStylePropsBase, void, {}>;
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map