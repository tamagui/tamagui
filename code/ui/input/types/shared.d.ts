import type { SizeVariantSpreadFunction } from '@tamagui/core';
export declare const defaultStyles: {
    readonly size: "$true";
    readonly fontFamily: "$body";
    readonly borderWidth: 1;
    readonly outlineWidth: 0;
    readonly color: "$color";
    readonly tabIndex: 0;
    readonly borderColor: "$borderColor";
    readonly backgroundColor: "$background";
    readonly minWidth: 0;
    readonly hoverStyle: {
        readonly borderColor: "$borderColorHover";
    };
    readonly focusStyle: {
        readonly borderColor: "$borderColorFocus";
    };
    readonly focusVisibleStyle: {
        readonly outlineColor: "$outlineColor";
        readonly outlineWidth: 2;
        readonly outlineStyle: "solid";
    };
};
export declare const inputSizeVariant: SizeVariantSpreadFunction<any>;
export declare const textAreaSizeVariant: SizeVariantSpreadFunction<any>;
export declare const INPUT_NAME = "Input";
export declare const styledBody: readonly [{
    readonly name: "Input";
    readonly render: "input";
    readonly variants: {
        readonly unstyled: {
            readonly true: {
                readonly outlineWidth: 0;
                readonly borderWidth: 0;
                readonly backgroundColor: "transparent";
            };
            readonly false: {
                readonly size: "$true";
                readonly fontFamily: "$body";
                readonly borderWidth: 1;
                readonly outlineWidth: 0;
                readonly color: "$color";
                readonly tabIndex: 0;
                readonly borderColor: "$borderColor";
                readonly backgroundColor: "$background";
                readonly minWidth: 0;
                readonly hoverStyle: {
                    readonly borderColor: "$borderColorHover";
                };
                readonly focusStyle: {
                    readonly borderColor: "$borderColorFocus";
                };
                readonly focusVisibleStyle: {
                    readonly outlineColor: "$outlineColor";
                    readonly outlineWidth: 2;
                    readonly outlineStyle: "solid";
                };
            };
        };
        readonly size: {
            readonly '...size': SizeVariantSpreadFunction<any>;
        };
        readonly disabled: {
            readonly true: {};
        };
    };
    readonly defaultVariants: {
        readonly unstyled: boolean;
    };
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
        readonly cursorColor: "color";
        readonly selectionHandleColor: "color";
        readonly underlineColorAndroid: "color";
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
}];
//# sourceMappingURL=shared.d.ts.map