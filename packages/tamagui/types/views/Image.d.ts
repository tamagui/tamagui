import { GetProps, StackProps } from '@tamagui/core';
import React from 'react';
import { ImageProps as RNImageProps } from 'react-native';
declare const StyledImage: import("@tamagui/core").StaticComponent<RNImageProps, void, any, import("@tamagui/core").StaticConfigParsed>;
declare type StyledImageProps = GetProps<typeof StyledImage>;
export declare type ImageProps = StackProps & Omit<StyledImageProps, 'source'> & {
    src?: string | StyledImageProps['source'];
};
export declare const Image: React.FC<ImageProps>;
export {};
//# sourceMappingURL=Image.d.ts.map