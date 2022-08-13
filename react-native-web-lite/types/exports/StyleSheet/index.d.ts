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
declare const stylesheet: IStyleSheet;
export default stylesheet;
//# sourceMappingURL=index.d.ts.map