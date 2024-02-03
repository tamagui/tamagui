import type { ScopedProps, TamaguiElement } from '@tamagui/core';
import { Slot } from '@tamagui/core';
import React from 'react';
type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps {
}
declare function createCollection<ItemElement extends TamaguiElement, ItemData = {}>(name: string): readonly [{
    readonly Provider: React.FC<{
        children?: React.ReactNode;
        __scopeCollection: string;
    }>;
    readonly Slot: React.ForwardRefExoticComponent<CollectionProps & {
        __scopeCollection?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    readonly ItemSlot: React.ForwardRefExoticComponent<React.PropsWithoutRef<ScopedProps<ItemData & {
        children: React.ReactNode;
    }, "Collection">> & React.RefAttributes<ItemElement>>;
}, (__scopeCollection: any) => () => ({
    ref: React.RefObject<ItemElement>;
} & ItemData)[]];
export { createCollection };
export type { CollectionProps };
//# sourceMappingURL=Collection.d.ts.map