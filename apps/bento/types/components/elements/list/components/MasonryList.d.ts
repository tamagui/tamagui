import type { RefreshControlProps, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { MutableRefObject, ReactElement } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';
interface Props<T> extends Omit<ScrollViewProps, 'refreshControl'> {
    innerRef?: MutableRefObject<ScrollView | undefined>;
    loading?: boolean;
    refreshing?: RefreshControlProps['refreshing'];
    onRefresh?: RefreshControlProps['onRefresh'];
    refreshControl?: boolean;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    style?: StyleProp<ViewStyle>;
    data: T[];
    renderItem: ({ item, i }: {
        item: T;
        i: number;
    }) => ReactElement;
    LoadingView?: React.ComponentType<any> | React.ReactElement | null;
    ListHeaderComponent?: React.ReactNode | null;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListHeaderComponentStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    numColumns?: number;
    keyExtractor?: ((item: T | any, index: number) => string) | undefined;
    refreshControlProps?: Omit<RefreshControlProps, 'onRefresh' | 'refreshing'>;
}
export declare const MasonryList: React.MemoExoticComponent<import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, unknown, import("@tamagui/web").TamaguiComponentPropsBaseBase & Props<unknown>, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>>;
export {};
//# sourceMappingURL=MasonryList.d.ts.map