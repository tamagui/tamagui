import type { GetProps, GetRef, StylePiece } from '@tamagui/web';
import React from 'react';
import { ScrollView as ReactNativeScrollView, type ScrollViewProps as ReactNativeScrollViewProps } from 'react-native';
export declare const ScrollView: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<ReactNativeScrollViewProps, "contentContainerStyle"> & {
    contentContainerStyle?: StylePiece;
} & React.RefAttributes<ReactNativeScrollView>, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<ReactNativeScrollView> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, ReactNativeScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<ReactNativeScrollViewProps, "contentContainerStyle"> & {
    contentContainerStyle?: StylePiece;
} & React.RefAttributes<ReactNativeScrollView>, import("@tamagui/web").StackStyleBase, {}, {
    neverFlatten: true;
}> & Omit<{
    neverFlatten: true;
}, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, ReactNativeScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<ReactNativeScrollViewProps, "contentContainerStyle"> & {
        contentContainerStyle?: StylePiece;
    } & React.RefAttributes<ReactNativeScrollView>, import("@tamagui/web").StackStyleBase, {}, {
        neverFlatten: true;
    }];
};
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = Omit<GetProps<typeof ScrollView>, 'contentContainerStyle'> & {
    contentContainerStyle?: StylePiece;
};
//# sourceMappingURL=ScrollView.native.d.ts.map