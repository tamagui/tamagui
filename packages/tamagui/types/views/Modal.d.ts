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
export declare const ModalYStack: import("@tamagui/core").StaticComponent<Omit<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | undefined;
}>, never> & ({} | {
    [x: string]: string | number | undefined;
}) & import("@tamagui/core").MediaProps<{} | {
    [x: string]: string | number | undefined;
}>, any, import("@tamagui/core").StaticConfigParsed, any>;
//# sourceMappingURL=Modal.d.ts.map