import type { AnimatePresenceProps } from '@tamagui/animate-presence';
import type { YStackProps } from '@tamagui/stacks';
import type { GetProps, ViewProps, TamaguiElement } from '@tamagui/web';
import { View } from '@tamagui/web';
import * as React from 'react';
interface CollapsibleProps extends ViewProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof View>;
declare const CollapsibleTriggerFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
declare const CollapsibleTrigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
export interface CollapsibleContentExtraProps extends AnimatePresenceProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface CollapsibleContentProps extends CollapsibleContentExtraProps, YStackProps {
}
declare const CollapsibleContentFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
declare const CollapsibleContent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, keyof CollapsibleContentExtraProps> & CollapsibleContentExtraProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: string;
} & React.RefAttributes<TamaguiElement>> & {
    Trigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & void, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, keyof CollapsibleContentExtraProps> & CollapsibleContentExtraProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & CollapsibleContentExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map