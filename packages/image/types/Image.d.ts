import { GetProps, StackProps } from '@tamagui/core';
import React from 'react';
declare const StyledImage: import("@tamagui/core").TamaguiComponent<(import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>) | (import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), import("@tamagui/core").TamaguiElement, import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>, {
    [x: string]: undefined;
}>;
declare type StyledImageProps = GetProps<typeof StyledImage>;
declare type BaseProps = Omit<StyledImageProps, 'source' | 'width' | 'height' | 'style' | 'onLayout'> & {
    width: number | string;
    height: number | string;
    src: string | StyledImageProps['source'];
};
export declare type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>;
export declare const Image: React.FC<ImageProps>;
export {};
//# sourceMappingURL=Image.d.ts.map