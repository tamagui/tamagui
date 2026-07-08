import { View } from '@tamagui/core';
import * as React from 'react';
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof View>;
interface RovingFocusGroupImplProps extends Omit<PrimitiveDivProps, 'dir'>, RovingFocusGroupOptions {
    currentTabStopId?: string | null;
    defaultCurrentTabStopId?: string;
    onCurrentTabStopIdChange?: (tabStopId: string | null) => void;
    onEntryFocus?: (event: Event) => void;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof View>;
interface RovingFocusItemProps extends PrimitiveSpanProps {
    tabStopId?: string;
    active?: boolean;
}
declare const RovingFocusGroupItem: import("@tamagui/compose-refs").RefComponent<import("@tamagui/core").TamaguiElement, ScopedProps<RovingFocusItemProps>>;
type ScopedProps<P> = P & {
    __scopeRovingFocusGroup?: string;
};
type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';
interface RovingFocusGroupOptions {
    /**
     * The orientation of the group.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     */
    orientation?: Orientation;
    /**
     * The direction of navigation between items.
     */
    dir?: Direction;
    /**
     * Whether keyboard navigation should loop around
     * @defaultValue false
     */
    loop?: boolean;
}
interface RovingFocusGroupProps extends RovingFocusGroupImplProps {
}
declare const RovingFocusGroup: ((props: RovingFocusGroupProps & {
    __scopeRovingFocusGroup?: string;
} & import("@tamagui/compose-refs").RefProp<import("@tamagui/core").TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Item: import("@tamagui/compose-refs").RefComponent<import("@tamagui/core").TamaguiElement, ScopedProps<RovingFocusItemProps>>;
};
export { RovingFocusGroup, RovingFocusGroupItem };
export type { RovingFocusGroupProps, RovingFocusItemProps };
//# sourceMappingURL=RovingFocusGroup.d.ts.map