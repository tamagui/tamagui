import type { ScrollViewRef } from '@tamagui/scroll-view';
import React from 'react';
export declare const SheetScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, ScrollViewRef, Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
    style?: import("@tamagui/web").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/web").StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
} & React.RefAttributes<ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
//# sourceMappingURL=SheetScrollView.d.ts.map