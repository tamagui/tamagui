import type { GetProps, GetRef } from '@tamagui/web';
import { ScrollView as ScrollViewNative } from 'react-native';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, ScrollViewNative, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<typeof ScrollViewNative, {
        accept: {
            readonly contentContainerStyle: "style";
        };
    }>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}, {
    accept: {
        readonly contentContainerStyle: "style";
    };
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map