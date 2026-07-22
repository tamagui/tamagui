import type { SizeVariantSpreadFunction } from '@tamagui/core';
export declare const defaultStyles: {
    readonly size: true;
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
};
export declare const inputSizeVariant: SizeVariantSpreadFunction<any>;
export declare const textAreaSizeVariant: SizeVariantSpreadFunction<any>;
export declare const INPUT_NAME = "Input";
export declare const styledBody: readonly [{
    readonly size: true;
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
    readonly name: "Input";
    readonly render: 'input';
    readonly variants: {
        readonly size: {
            readonly true: SizeVariantSpreadFunction<any>;
            readonly Size: SizeVariantSpreadFunction<any>;
        };
        readonly disabled: {
            readonly true: {};
        };
    };
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: 'color';
        readonly selectionColor: 'color';
        readonly cursorColor: 'color';
        readonly selectionHandleColor: 'color';
        readonly underlineColorAndroid: 'color';
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
}];
//# sourceMappingURL=shared.d.ts.map