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
declare const CollapsibleTriggerFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>;
declare const CollapsibleTrigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, Omit<import("@tamagui/web").StackStyleBase, never>, {}, {}>;
export interface CollapsibleContentExtraProps extends AnimatePresenceProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
interface CollapsibleContentProps extends CollapsibleContentExtraProps, ThemeableStackProps {
}
declare const CollapsibleContentFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>;
declare const CollapsibleContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentExtraProps, Omit<import("@tamagui/web").StackStyleBase, keyof CollapsibleContentExtraProps>, {}, {}>;
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: string | undefined;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement>> & {
    Trigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, Omit<import("@tamagui/web").StackStyleBase, never>, {}, {}>;
    Content: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentExtraProps, Omit<import("@tamagui/web").StackStyleBase, keyof CollapsibleContentExtraProps>, {}, {}>;
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map