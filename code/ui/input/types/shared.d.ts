export declare const defaultStyles: {
    readonly size: true;
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
};
export declare const inputSizeVariant: import("@tamagui/web/types/types").StyledDynamicFn<any, Record<string, any>>;
export declare const textAreaSizeVariant: import("@tamagui/web/types/types").StyledDynamicFn<any, Record<string, any>>;
export declare const resolveTextAreaSize: (props: Record<string, any>, env: Parameters<typeof textAreaSizeVariant>[1]) => {
    borderRadius: any;
    color: any;
    fontFamily: any;
    fontSize: any;
    fontStyle: any;
    fontWeight: any;
    letterSpacing: any;
    lineHeight: any;
    textTransform: any;
    paddingVertical: any;
    paddingHorizontal: any;
    height: any;
};
export declare const resolveMultilineInputSize: (props: Record<string, any>, env: Parameters<typeof textAreaSizeVariant>[1]) => {
    borderRadius: any;
    color: any;
    fontFamily: any;
    fontSize: any;
    fontStyle: any;
    fontWeight: any;
    letterSpacing: any;
    lineHeight: any;
    textTransform: any;
    paddingVertical: any;
    paddingHorizontal: any;
    height: any;
} | undefined;
export declare const INPUT_NAME = "Input";
export declare const styledBody: readonly [{
    readonly size: true;
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
    readonly name: "Input";
    readonly render: 'input';
    readonly variants: {
        readonly size: import("@tamagui/web/types/types").StyledDynamicFn<any, Record<string, any>>;
        readonly disabled: {
            readonly true: {};
        };
    };
}, {
    readonly isInput: true;
}];
//# sourceMappingURL=shared.d.ts.map