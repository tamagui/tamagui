import { Slot } from '@tamagui/core';
import React from 'react';
type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps {
    scope: any;
}
declare function createCollection<ItemElement extends HTMLElement, ItemData = {}>(name: string): readonly [{
    readonly Provider: React.FC<{
        children?: React.ReactNode;
        scope: any;
    }>;
    readonly Slot: React.ForwardRefExoticComponent<CollectionProps & React.RefAttributes<HTMLElement>>;
    readonly ItemSlot: React.ForwardRefExoticComponent<React.PropsWithoutRef<ItemData & {
        children: React.ReactNode;
        scope: any;
    }> & React.RefAttributes<ItemElement>>;
}, (scope: any) => () => ({
    ref: React.RefObject<ItemElement>;
} & ItemData)[], import("@tamagui/create-context").CreateScope];
export { createCollection };
export type { CollectionProps };
//# sourceMappingURL=Collection.d.ts.map