/// <reference types="react" />
import { ModalBaseProps, ModalPropsAndroid, ModalPropsIOS } from 'react-native';
import { YStackProps } from './Stacks';
declare type ModalPropsReact = ModalBaseProps & ModalPropsIOS & ModalPropsAndroid;
export declare type ModalProps = Omit<ModalPropsReact, 'children'> & YStackProps & {
    visible?: boolean;
    overlayBackground?: string;
    overlayDismisses?: boolean;
    children?: any | ((isOpen?: boolean) => any);
};
export declare const Modal: (props: ModalProps) => JSX.Element;
export declare const ModalYStack: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {}> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {}>, any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {}>;
export {};
//# sourceMappingURL=Modal.d.ts.map