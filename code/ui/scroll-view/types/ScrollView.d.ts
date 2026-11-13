import type { GetProps, GetRef } from '@tamagui/web';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("./WebScrollView.js").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "pointerEvents" | "refreshControl" | keyof import("@tamagui/web").RNViewProps | keyof import("@tamagui/web").StackNonStyleProps> & {
    pointerEvents?: import("@tamagui/web").ViewProps['pointerEvents'];
    style?: import("@tamagui/web").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/web").StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: import("./WebScrollView.js").WebScrollEventHandler;
    onScrollToTop?: import("./WebScrollView.js").WebScrollEventHandler;
    onScrollBeginDrag?: import("./WebScrollView.js").WebScrollEventHandler;
    onScrollEndDrag?: import("./WebScrollView.js").WebScrollEventHandler;
    onMomentumScrollBegin?: import("./WebScrollView.js").WebScrollEventHandler;
    onMomentumScrollEnd?: import("./WebScrollView.js").WebScrollEventHandler;
} & import("react").RefAttributes<import("./WebScrollView.js").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map