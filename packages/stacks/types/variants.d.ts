export declare const elevate: {
    true: (_: boolean, extras: any) => any;
};
export declare const bordered: (val: boolean | number, { props }: {
    props: any;
}) => any;
export declare const padded: {
    true: (_: any, extras: any) => {
        padding: any;
    };
};
export declare const radiused: {
    true: (_: any, extras: any) => {
        borderRadius: any;
    };
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
export declare const hoverTheme: {
    true: {
        hoverStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {};
};
export declare const pressTheme: {
    true: {
        cursor: string;
        pressStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {};
};
export declare const focusTheme: {
    true: {
        focusStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {};
};
//# sourceMappingURL=variants.d.ts.map