export declare const elevate: {
    true: (_: boolean, extras: any) => any;
};
export declare const bordered: (val: boolean | number, { props }: {
    props: any;
}) => {
    borderWidth: number;
    borderColor: string;
};
export declare const circular: {
    true: (_: any, { props, tokens }: {
        props: any;
        tokens: any;
    }) => {
        borderRadius: number;
        padding: number;
    } | {
        width: any;
        height: any;
        maxWidth: any;
        maxHeight: any;
        minWidth: any;
        minHeight: any;
        borderRadius: number;
        padding: number;
    };
};
//# sourceMappingURL=variants.d.ts.map