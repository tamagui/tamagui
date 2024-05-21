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
    line?: string | undefined;
    css?: any;
    mode?: "static" | undefined;
    showLineNumbers?: boolean | undefined;
} & React.RefAttributes<HTMLPreElement>>;
export default _default;
declare const Pre: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=CodeBlock.d.ts.map