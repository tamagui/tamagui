import { GetProps } from '@tamagui/core';
export declare const createFrameSizeVariant: (sizeX?: number, sizeY?: number) => (val: string | undefined, { tokens, props }: {
    tokens: any;
    props: any;
}) => {
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: any;
};
export declare const interactiveFrameVariants: {
    readonly size: {
        readonly '...size': (val: string | undefined, { tokens, props }: {
            tokens: any;
            props: any;
        }) => {
            paddingHorizontal: number;
            paddingVertical: number;
            borderRadius: any;
        };
    };
    readonly disabled: {
        readonly true: {
            readonly opacity: 0.45;
            readonly backgroundColor: "$bg";
            readonly hoverStyle: {
                readonly backgroundColor: "$bg";
            };
        };
    };
    readonly active: {
        readonly true: {
            readonly backgroundColor: "$bg3";
        };
    };
    readonly transparent: {
        readonly true: {
            readonly backgroundColor: "transparent";
        };
    };
    readonly chromeless: {
        readonly true: {
            readonly backgroundColor: "transparent";
            readonly borderColor: "transparent";
            readonly shadowColor: "transparent";
        };
    };
};
export declare const InteractiveFrame: import("@tamagui/core").StaticComponent<Omit<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | null | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, "size" | "transparent" | "disabled" | "active" | "chromeless"> & {
    readonly size?: `$${string}` | `$${number}` | null | undefined;
    readonly disabled?: boolean | null | undefined;
    readonly active?: boolean | null | undefined;
    readonly transparent?: boolean | null | undefined;
    readonly chromeless?: boolean | null | undefined;
} & import("@tamagui/core").MediaProps<{
    readonly size?: `$${string}` | `$${number}` | null | undefined;
    readonly disabled?: boolean | null | undefined;
    readonly active?: boolean | null | undefined;
    readonly transparent?: boolean | null | undefined;
    readonly chromeless?: boolean | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare type InteractiveFrameProps = GetProps<typeof InteractiveFrame>;
//# sourceMappingURL=InteractiveFrame.d.ts.map