import type { ScrollViewRef } from '@tamagui/scroll-view';
import React from 'react';
export declare const SheetScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & Omit<import("@tamagui/react-native-types/src").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | keyof import("@tamagui/core").RNViewProps | keyof import("@tamagui/core").StackNonStyleProps> & {
    style?: import("@tamagui/core").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/core").StackNonStyleProps['style'];
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
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
//# sourceMappingURL=SheetScrollView.d.ts.map