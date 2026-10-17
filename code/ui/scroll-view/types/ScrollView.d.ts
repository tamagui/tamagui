import type { GetProps, GetRef, StylePiece } from '@tamagui/web';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("./WebScrollView").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("./WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("./WebScrollView").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = Omit<GetProps<typeof ScrollView>, 'contentContainerStyle'> & {
    contentContainerStyle?: StylePiece;
};
//# sourceMappingURL=ScrollView.d.ts.map