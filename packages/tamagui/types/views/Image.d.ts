/// <reference types="react" />
import { GetProps } from '@tamagui/core';
import { ImageProps as RNImageProps } from 'react-native';
export declare type ImageProps = Omit<StyledImageProps, 'source'> & {
    src?: string | StyledImageProps['source'];
};
declare const StyledImage: import("@tamagui/core").StaticComponent<RNImageProps, void, import("@tamagui/core").StaticConfigParsed, any>;
declare type StyledImageProps = GetProps<typeof StyledImage>;
export declare const Image: ({ src, width, height, ...rest }: ImageProps) => JSX.Element | null;
export {};
//# sourceMappingURL=Image.d.ts.map