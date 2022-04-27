import { GetProps, StackProps } from '@tamagui/core';
import React from 'react';
declare const StyledImage: import("@tamagui/core").TamaguiComponent<(import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>) | (import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<Object, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<Object, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<Object, string | number> & {
    [x: string]: undefined;
}>>), any, import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>, Object & ({} | {
    [x: string]: undefined;
})>;
declare type StyledImageProps = GetProps<typeof StyledImage>;
export declare type ImageProps = Omit<StackProps, keyof StyledImageProps> & Omit<StyledImageProps, 'source' | 'width' | 'height' | 'style' | 'onLayout'> & {
    width: number;
    height: number;
    src: string | StyledImageProps['source'];
};
export declare const Image: React.FC<ImageProps>;
export {};
//# sourceMappingURL=Image.d.ts.map