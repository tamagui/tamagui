import type { GetProps, GetRef } from '@tamagui/web';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("./WebScrollView").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
    style?: import("@tamagui/web").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/web").StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: import("./WebScrollView").WebScrollEventHandler;
    onScrollToTop?: import("./WebScrollView").WebScrollEventHandler;
    onScrollBeginDrag?: import("./WebScrollView").WebScrollEventHandler;
    onScrollEndDrag?: import("./WebScrollView").WebScrollEventHandler;
    onMomentumScrollBegin?: import("./WebScrollView").WebScrollEventHandler;
    onMomentumScrollEnd?: import("./WebScrollView").WebScrollEventHandler;
} & import("react").RefAttributes<import("./WebScrollView").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map