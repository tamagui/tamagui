import type { TamaguiComponentExpectingVariants, TextProps, ViewProps } from '@tamagui/web';
export declare const createButton: <Variants extends Record<string, any>>(options: {
    Frame: TamaguiComponentExpectingVariants<ViewProps, Variants>;
    Text: TamaguiComponentExpectingVariants<TextProps, Variants>;
    Icon: TamaguiComponentExpectingVariants<TextProps, Variants>;
    defaultVariants?: { [Key in keyof Variants]: Variants[Key] | undefined; };
    name?: string;
}) => import("react").ForwardRefExoticComponent<import("@tamagui/web").GetFinalProps<any, any, Variants> & import("react").RefAttributes<import("@tamagui/web").GetRef<TamaguiComponentExpectingVariants<import("@tamagui/web").StackProps, Variants>>>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").GetRef<TamaguiComponentExpectingVariants<import("@tamagui/web").StackProps, Variants>>, any, any, Variants, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").GetRef<TamaguiComponentExpectingVariants<import("@tamagui/web").StackProps, Variants>>, any, any, Variants, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").ProviderExoticComponent<Partial<{ [Key in keyof Variants]: Variants[Key] | undefined; }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").GetRef<TamaguiComponentExpectingVariants<TextProps, Variants>>, any, any, Variants, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").GetRef<TamaguiComponentExpectingVariants<TextProps, Variants>>, any, any, Variants, import("@tamagui/web").StaticConfigPublic>;
};
//# sourceMappingURL=createButton.d.ts.map