import React from 'react';
import type { GetProps } from 'tamagui';
type PreProps = Omit<GetProps<typeof Pre>, 'css'>;
export type CodeBlockProps = PreProps & {
    language: 'tsx';
    value: string;
    line?: string;
    css?: any;
    mode?: 'static';
    showLineNumbers?: boolean;
};
declare const _default: React.ForwardRefExoticComponent<PreProps & {
    language: "tsx";
    value: string;
    line?: string;
    css?: any;
    mode?: "static";
    showLineNumbers?: boolean;
} & React.RefAttributes<HTMLPreElement>>;
export default _default;
export declare const CodeInline: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
declare const Pre: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=CodeBlock.d.ts.map