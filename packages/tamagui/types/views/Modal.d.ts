/// <reference types="react" />
import { AnimatedStackProps } from '@tamagui/core';
import { ModalProps as ModalPropsReact } from 'react-native';
export declare type ModalProps = Omit<ModalPropsReact, 'children'> & AnimatedStackProps & {
    visible?: boolean;
    overlayBackground?: string;
    overlayDismisses?: boolean;
    children?: any | ((isOpen?: boolean) => any);
};
export declare const Modal: (props: ModalProps) => JSX.Element;
export declare const ModalYStack: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
//# sourceMappingURL=Modal.d.ts.map