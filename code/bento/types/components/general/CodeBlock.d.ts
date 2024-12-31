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
declare const Pre: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("tamagui").SizeTokens | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=CodeBlock.d.ts.map