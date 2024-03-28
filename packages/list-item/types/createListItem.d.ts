import type { TamaguiComponent, TextProps } from '@tamagui/web';
import { View } from '@tamagui/web';
import { ContextProps } from './StyledContext';
type TextType = (props: TextProps & ContextProps) => any;
export declare function createListItem<F extends TamaguiComponent<ContextProps>, T extends TextType, I extends TamaguiComponent<{
    after?: boolean;
}>, C extends typeof View>(createProps: {
    Frame: F;
    ListText: T;
    Title: T;
    Subtitle: T;
    Icon: I;
    TextContent: C;
}): F & {
    Text: TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | T;
    Title: T;
    Subtitle: T;
    Icon: I;
    TextContent: C;
};
export {};
//# sourceMappingURL=createListItem.d.ts.map