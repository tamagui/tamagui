import { Stack } from '@tamagui/core';
import * as React from 'react';
/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
declare function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T;
export { useCallbackRef };
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface RovingFocusGroupImplProps extends Omit<PrimitiveDivProps, 'dir'>, RovingFocusGroupOptions {
    currentTabStopId?: string | null;
    defaultCurrentTabStopId?: string;
    onCurrentTabStopIdChange?: (tabStopId: string | null) => void;
    onEntryFocus?: (event: Event) => void;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface RovingFocusItemProps extends PrimitiveSpanProps {
    tabStopId?: string;
    focusable?: boolean;
    active?: boolean;
}
declare const createRovingFocusGroupScope: import("@tamagui/create-context").CreateScope;
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
declare const RovingFocusGroup: React.ForwardRefExoticComponent<RovingFocusGroupProps & React.RefAttributes<import("react-native").View>> & {
    Item: React.ForwardRefExoticComponent<RovingFocusItemProps & React.RefAttributes<import("react-native").View>>;
};
export { createRovingFocusGroupScope, RovingFocusGroup };
export type { RovingFocusGroupProps, RovingFocusItemProps };
//# sourceMappingURL=RovingFocusGroup.d.ts.map