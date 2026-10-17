import type { AnimatePresenceProps } from '@tamagui/animate-presence';
import type { YStackProps } from '@tamagui/stacks';
import type { GetProps, ViewProps, TamaguiElement } from '@tamagui/web';
import { View } from '@tamagui/web';
type ScopedProps<P> = P & {
    __scopeCollapsible?: string;
};
interface CollapsibleProps extends ViewProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof View>;
declare const CollapsibleTriggerFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
declare const CollapsibleTrigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    __scopeCollapsible?: string;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>, import("@tamagui/web").StaticConfigPublic>;
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
declare const CollapsibleContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof CollapsibleContentProps> & CollapsibleContentProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof CollapsibleContentProps>, import("@tamagui/web").StaticConfigPublic>;
declare const Collapsible: import("@tamagui/helpers").Combined<import("@tamagui/web").RefComponent<TamaguiElement, ScopedProps<CollapsibleProps>>, {
    Trigger: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "__scopeCollapsible" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        __scopeCollapsible?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeCollapsible" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof CollapsibleContentProps> & CollapsibleContentProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof CollapsibleContentProps>, import("@tamagui/web").StaticConfigPublic>;
}>;
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map