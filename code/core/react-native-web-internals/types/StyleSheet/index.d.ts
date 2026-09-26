/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
declare const absoluteFillObject: {
    position: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
};
declare const absoluteFill: any;
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
export declare function StyleSheet(styles: any, options?: Options): StyleProps;
export declare namespace StyleSheet {
    export { absoluteFill };
    export { absoluteFillObject };
    export { create };
    export { compose };
    export { flatten };
    export { getSheet };
    export var hairlineWidth: number;
}
export type IStyleSheet = {
    (styles: any, options?: Options): StyleProps;
    absoluteFill: object;
    absoluteFillObject: object;
    create: typeof create;
    compose: typeof compose;
    flatten: typeof flatten;
    getSheet: typeof getSheet;
    hairlineWidth: number;
};
export {};
//# sourceMappingURL=index.d.ts.map