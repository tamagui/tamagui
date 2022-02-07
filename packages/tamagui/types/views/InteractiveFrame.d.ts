import { GetProps } from '@tamagui/core';
export declare const getSize: (sizeX?: number, sizeY?: number) => (val: any, { tokens }: {
    tokens: any;
}) => {
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: any;
};
export declare const getButtonSize: (val: any, { tokens }: {
    tokens: any;
}) => {
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: any;
};
export declare const InteractiveFrame: import("@tamagui/core").StaticComponent<Omit<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}> & import("@tamagui/core").PseudoProps<{
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, "size" | "transparent" | "hoverable" | "pressable" | "circular" | "disabled" | "active" | "chromeless"> & {
    hoverable?: boolean | null | undefined;
    pressable?: boolean | null | undefined;
    size?: `$${string}` | `$${number}` | null | undefined;
    circular?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    active?: boolean | null | undefined;
    transparent?: boolean | null | undefined;
    chromeless?: boolean | null | undefined;
} & import("@tamagui/core").MediaProps<{
    hoverable?: boolean | null | undefined;
    pressable?: boolean | null | undefined;
    size?: `$${string}` | `$${number}` | null | undefined;
    circular?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    active?: boolean | null | undefined;
    transparent?: boolean | null | undefined;
    chromeless?: boolean | null | undefined;
}> & import("@tamagui/core").PseudoProps<{
    hoverable?: boolean | null | undefined;
    pressable?: boolean | null | undefined;
    size?: `$${string}` | `$${number}` | null | undefined;
    circular?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    active?: boolean | null | undefined;
    transparent?: boolean | null | undefined;
    chromeless?: boolean | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare type InteractiveFrameProps = GetProps<typeof InteractiveFrame>;
//# sourceMappingURL=InteractiveFrame.d.ts.map