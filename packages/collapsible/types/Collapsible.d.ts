import { StackProps, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
declare const createCollapsibleScope: import("@tamagui/create-context").CreateScope;
interface CollapsibleProps extends StackProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & React.RefAttributes<TamaguiElement>>;
interface CollapsibleTriggerProps extends StackProps {
}
declare const CollapsibleTrigger: React.ForwardRefExoticComponent<CollapsibleTriggerProps & React.RefAttributes<TamaguiElement>>;
interface CollapsibleContentProps extends Omit<CollapsibleContentImplProps, 'present'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const CollapsibleContent: React.ForwardRefExoticComponent<CollapsibleContentProps & React.RefAttributes<TamaguiElement>>;
interface CollapsibleContentImplProps extends StackProps {
    present: boolean;
}
declare const Root: React.ForwardRefExoticComponent<CollapsibleProps & React.RefAttributes<TamaguiElement>>;
declare const Trigger: React.ForwardRefExoticComponent<CollapsibleTriggerProps & React.RefAttributes<TamaguiElement>>;
declare const Content: React.ForwardRefExoticComponent<CollapsibleContentProps & React.RefAttributes<TamaguiElement>>;
export { createCollapsibleScope, Collapsible, CollapsibleTrigger, CollapsibleContent, Root, Trigger, Content, };
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps };
//# sourceMappingURL=Collapsible.d.ts.map