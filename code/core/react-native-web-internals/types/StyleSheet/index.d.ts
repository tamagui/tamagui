/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
/**
 * create
 */
declare function create(styles: any): any;
/**
 * compose
 */
declare function compose(style1: any, style2: any): any;
/**
 * flatten
 */
export declare function flatten(...styles: any): {
    [key: string]: any;
};
/**
 * getSheet
 */
declare function getSheet(): {
    id: string;
    textContent: string;
};
/**
 * resolve
 */
type StyleProps = [string, {
    [key: string]: any;
} | null];
type Options = {
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
    var flatten: typeof import(".").flatten;
    var getSheet: () => {
        id: string;
        textContent: string;
    };
    var hairlineWidth: number;
}
export default StyleSheet;
export type IStyleSheet = {
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