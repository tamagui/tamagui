import type { TamaguiElement } from '@tamagui/core';
import { Slot } from '@tamagui/core';
import React from 'react';
type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps {
}
declare function createCollection<ItemElement extends TamaguiElement, ItemData = {}>(name: string): readonly [{
    readonly Provider: React.FC<{
        children?: React.ReactNode;
    } & {
        scope?: any;
    }>;
    readonly Slot: import("@tamagui/compose-refs").RefComponent<TamaguiElement | undefined, CollectionProps & {
        scope?: any;
    }>;
    readonly ItemSlot: import("@tamagui/compose-refs").RefComponent<ItemElement | undefined, ItemData & {
        children: React.ReactNode;
    } & {
        scope?: any;
    }>;
}, (scope: string) => () => ({
    ref: React.RefObject<ItemElement | undefined>;
} & ItemData)[]];
export { createCollection };
export type { CollectionProps };
//# sourceMappingURL=Collection.d.ts.map