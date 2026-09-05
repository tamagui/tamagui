export declare const selectionStyles: (theme: any) => {
    backgroundColor: any;
    color: any;
} | null;
export declare const settings: {
    mediaQueryDefaultActive: {
        touchable: boolean;
        hoverable: boolean;
        'max-xxl': boolean;
        'max-xl': boolean;
        'max-lg': boolean;
        'max-md': boolean;
        'max-sm': boolean;
        'max-xs': boolean;
        'max-xxs': boolean;
        'max-xxxs': boolean;
        xxxs: boolean;
        xxs: boolean;
        xs: boolean;
        sm: boolean;
        md: boolean;
        lg: boolean;
        xl: boolean;
        xxl: boolean;
        'max-height-sm': boolean;
        'max-height-md': boolean;
        'max-height-lg': boolean;
        'height-sm': boolean;
        'height-md': boolean;
        'height-lg': boolean;
    };
    defaultFont: string;
    fastSchemeChange: true;
    shouldAddPrefersColorThemes: true;
    allowedStyleValues: "somewhat-strict-web";
    addThemeClassName: "html";
    onlyAllowShorthands: true;
    styleCompat: "web";
};
export type Settings = typeof settings;
/**
 * Named control sizes on the v5 scales. v5 space is a fraction of size, so the
 * keys step unevenly: space 2 = 7px, 2-5 = 10px, 3 = 13px, 4 = 18px.
 */
export declare const sizes: {
    readonly default: 'md';
    readonly xs: {
        readonly fontSize: '2';
        readonly paddingX: '2';
        readonly paddingY: '1-5';
        readonly radius: '2';
    };
    readonly sm: {
        readonly fontSize: '3';
        readonly paddingX: '3';
        readonly paddingY: '2';
        readonly radius: '3';
    };
    readonly md: {
        readonly fontSize: '4';
        readonly paddingX: '4';
        readonly paddingY: '2';
        readonly radius: '4';
    };
    readonly lg: {
        readonly fontSize: '5';
        readonly paddingX: '5';
        readonly paddingY: '2-5';
        readonly radius: '5';
    };
    readonly xl: {
        readonly fontSize: '6';
        readonly paddingX: '6';
        readonly paddingY: '3';
        readonly radius: '6';
    };
};
//# sourceMappingURL=settings.d.ts.map