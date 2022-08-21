declare function create(styles: any): any;
declare function compose(style1: any, style2: any): any;
declare function flatten(...styles: any): {
    [key: string]: any;
};
declare function getSheet(): {
    id: string;
    textContent: string;
};
declare type StyleProps = [string, {
    [key: string]: any;
} | null];
declare type Options = {
    writingDirection: 'ltr' | 'rtl';
};
declare function StyleSheet(styles: any, options?: Options): StyleProps;
declare namespace StyleSheet {
    var absoluteFill: any;
    var absoluteFillObject: {
        position: string;
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    var create: (styles: any) => any;
    var compose: (style1: any, style2: any) => any;
    var flatten: (...styles: any) => {
        [key: string]: any;
    };
    var getSheet: () => {
        id: string;
        textContent: string;
    };
    var hairlineWidth: number;
}
export default StyleSheet;
export declare type IStyleSheet = {
    (styles: any, options?: Options): StyleProps;
    absoluteFill: Object;
    absoluteFillObject: Object;
    create: typeof create;
    compose: typeof compose;
    flatten: typeof flatten;
    getSheet: typeof getSheet;
    hairlineWidth: number;
};
//# sourceMappingURL=index.d.ts.map