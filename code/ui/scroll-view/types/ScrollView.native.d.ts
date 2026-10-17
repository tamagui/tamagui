import type { GetProps, GetRef, StylePiece } from '@tamagui/web';
import React from 'react';
import { type ScrollViewInstance, type ScrollViewProps as ReactNativeScrollViewProps } from 'react-native';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, ScrollViewInstance, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<ReactNativeScrollViewProps, "contentContainerStyle"> & {
    contentContainerStyle?: StylePiece;
} & React.RefAttributes<ScrollViewInstance>, import("@tamagui/web").StackStyleBase, {}, {
    neverFlatten: true;
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = Omit<GetProps<typeof ScrollView>, 'contentContainerStyle'> & {
    contentContainerStyle?: StylePiece;
};
//# sourceMappingURL=ScrollView.native.d.ts.map