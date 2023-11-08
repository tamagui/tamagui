/// <reference types="react" />
import { GetProps } from '@tamagui/web';
import { ScrollView as ScrollViewNative } from 'react-native';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("react-native").ScrollViewProps & Omit<import("@tamagui/web").StackProps, keyof import("react-native").ScrollViewProps> & {
    readonly fullscreen?: boolean | undefined;
} & import("@tamagui/web").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/web").StackProps, keyof import("react-native").ScrollViewProps> & {
    readonly fullscreen?: boolean | undefined;
}>> & import("@tamagui/web").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/web").StackProps, keyof import("react-native").ScrollViewProps> & {
    readonly fullscreen?: boolean | undefined;
}>>, ScrollViewNative, import("react-native").ScrollViewProps & Omit<import("@tamagui/web").StackProps, keyof import("react-native").ScrollViewProps>, {
    readonly fullscreen?: boolean | undefined;
}, {
    prototype: ScrollViewNative;
    contextType: import("react").Context<any> | undefined;
}>;
export type ScrollView = Pick<ScrollViewNative, 'scrollTo'>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map