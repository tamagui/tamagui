import type { BuildPalettes, BuildThemeSuiteProps } from './types';
export { defaultTemplates } from './v4-defaultTemplates';
export type * from './types';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export declare function createThemes({ templates, palettes: palettesIn, }: {
    palettes?: BuildThemeSuiteProps['palettes'];
    templates?: BuildThemeSuiteProps['templates'];
}): {
    themes: {
        [x: `light_${string}`]: any;
        [x: `dark_${string}`]: any;
        [x: `light_${string}_${string}`]: any;
        [x: `dark_${string}_${string}`]: any;
        [x: `light_${string}_${string}_${string}`]: any;
        [x: `dark_${string}_${string}_${string}`]: any;
        readonly light: {
            [x: string]: string;
        };
        readonly dark: {
            [x: string]: string;
        };
    };
    themeBuilder: import("@tamagui/theme-builder").ThemeBuilder<Omit<{
        palettes: Record<string, string[]>;
    } & {
        templates: import("./types").BuildTemplates;
    }, "themes"> & {
        themes: {
            readonly light: {
                readonly template: "base";
                readonly palette: "light";
            };
            readonly dark: {
                readonly template: "base";
                readonly palette: "dark";
            };
        };
    } & {
        themes: {
            [x: `light_${string}`]: {
                [x: string]: {
                    theme: {
                        [x: string]: string;
                    };
                } | {
                    nonInheritedValues?: {
                        [x: string]: string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        };
                    } | undefined;
                    palette?: string | undefined;
                    template: string;
                } | {
                    palette?: (string | {
                        isVar: true;
                        variable?: string | undefined;
                        val: any;
                        name: string;
                        key: string;
                    })[] | undefined;
                    override?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideStrategy?: "shift" | "swap" | undefined;
                    overrideSwap?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideShift?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    skip?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    strength?: number | undefined;
                    max?: number | undefined;
                    min?: number | undefined;
                    parentName?: string | undefined;
                    mask: (string & {}) | {
                        readonly [x: number]: string;
                        toString: () => string;
                        charAt: (pos: number) => string;
                        charCodeAt: (index: number) => number;
                        concat: (...strings: string[]) => string;
                        indexOf: (searchString: string, position?: number) => number;
                        lastIndexOf: (searchString: string, position?: number) => number;
                        localeCompare: {
                            (that: string): number;
                            (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                            (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                        };
                        match: {
                            (regexp: string | RegExp): RegExpMatchArray | null;
                            (matcher: {
                                [Symbol.match](string: string): RegExpMatchArray | null;
                            }): RegExpMatchArray | null;
                        };
                        replace: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replaceValue: string): string;
                            }, replaceValue: string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                            }, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        search: {
                            (regexp: string | RegExp): number;
                            (searcher: {
                                [Symbol.search](string: string): number;
                            }): number;
                        };
                        slice: (start?: number, end?: number) => string;
                        split: {
                            (separator: string | RegExp, limit?: number): string[];
                            (splitter: {
                                [Symbol.split](string: string, limit?: number): string[];
                            }, limit?: number): string[];
                        };
                        substring: (start: number, end?: number) => string;
                        toLowerCase: () => string;
                        toLocaleLowerCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        toUpperCase: () => string;
                        toLocaleUpperCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        trim: () => string;
                        readonly length: number;
                        substr: (from: number, length?: number) => string;
                        valueOf: () => string;
                        codePointAt: (pos: number) => number | undefined;
                        includes: (searchString: string, position?: number) => boolean;
                        endsWith: (searchString: string, endPosition?: number) => boolean;
                        normalize: {
                            (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                            (form?: string): string;
                        };
                        repeat: (count: number) => string;
                        startsWith: (searchString: string, position?: number) => boolean;
                        anchor: (name: string) => string;
                        big: () => string;
                        blink: () => string;
                        bold: () => string;
                        fixed: () => string;
                        fontcolor: (color: string) => string;
                        fontsize: {
                            (size: number): string;
                            (size: string): string;
                        };
                        italics: () => string;
                        link: (url: string) => string;
                        small: () => string;
                        strike: () => string;
                        sub: () => string;
                        sup: () => string;
                        padStart: (maxLength: number, fillString?: string) => string;
                        padEnd: (maxLength: number, fillString?: string) => string;
                        trimEnd: () => string;
                        trimStart: () => string;
                        trimLeft: () => string;
                        trimRight: () => string;
                        matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                        replaceAll: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        at: (index: number) => string | undefined;
                        isWellFormed: () => boolean;
                        toWellFormed: () => string;
                        [Symbol.iterator]: () => StringIterator<string>;
                    };
                    avoidNestingWithin?: string[] | undefined;
                    childOptions?: {
                        palette?: (string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        })[] | undefined;
                        override?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideStrategy?: "shift" | "swap" | undefined;
                        overrideSwap?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideShift?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        skip?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        strength?: number | undefined;
                        max?: number | undefined;
                        min?: number | undefined;
                        parentName?: string | undefined;
                        mask?: (string & {}) | {
                            readonly [x: number]: string;
                            toString: () => string;
                            charAt: (pos: number) => string;
                            charCodeAt: (index: number) => number;
                            concat: (...strings: string[]) => string;
                            indexOf: (searchString: string, position?: number) => number;
                            lastIndexOf: (searchString: string, position?: number) => number;
                            localeCompare: {
                                (that: string): number;
                                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                            };
                            match: {
                                (regexp: string | RegExp): RegExpMatchArray | null;
                                (matcher: {
                                    [Symbol.match](string: string): RegExpMatchArray | null;
                                }): RegExpMatchArray | null;
                            };
                            replace: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replaceValue: string): string;
                                }, replaceValue: string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                                }, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            search: {
                                (regexp: string | RegExp): number;
                                (searcher: {
                                    [Symbol.search](string: string): number;
                                }): number;
                            };
                            slice: (start?: number, end?: number) => string;
                            split: {
                                (separator: string | RegExp, limit?: number): string[];
                                (splitter: {
                                    [Symbol.split](string: string, limit?: number): string[];
                                }, limit?: number): string[];
                            };
                            substring: (start: number, end?: number) => string;
                            toLowerCase: () => string;
                            toLocaleLowerCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            toUpperCase: () => string;
                            toLocaleUpperCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            trim: () => string;
                            readonly length: number;
                            substr: (from: number, length?: number) => string;
                            valueOf: () => string;
                            codePointAt: (pos: number) => number | undefined;
                            includes: (searchString: string, position?: number) => boolean;
                            endsWith: (searchString: string, endPosition?: number) => boolean;
                            normalize: {
                                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                                (form?: string): string;
                            };
                            repeat: (count: number) => string;
                            startsWith: (searchString: string, position?: number) => boolean;
                            anchor: (name: string) => string;
                            big: () => string;
                            blink: () => string;
                            bold: () => string;
                            fixed: () => string;
                            fontcolor: (color: string) => string;
                            fontsize: {
                                (size: number): string;
                                (size: string): string;
                            };
                            italics: () => string;
                            link: (url: string) => string;
                            small: () => string;
                            strike: () => string;
                            sub: () => string;
                            sup: () => string;
                            padStart: (maxLength: number, fillString?: string) => string;
                            padEnd: (maxLength: number, fillString?: string) => string;
                            trimEnd: () => string;
                            trimStart: () => string;
                            trimLeft: () => string;
                            trimRight: () => string;
                            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                            replaceAll: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            at: (index: number) => string | undefined;
                            isWellFormed: () => boolean;
                            toWellFormed: () => string;
                            [Symbol.iterator]: () => StringIterator<string>;
                        } | undefined;
                    } | undefined;
                } | ({
                    theme: {
                        [x: string]: string;
                    };
                    parent: string;
                } | {
                    nonInheritedValues?: {
                        [x: string]: string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        };
                    } | undefined;
                    palette?: string | undefined;
                    template: string;
                    parent: string;
                } | {
                    palette?: (string | {
                        isVar: true;
                        variable?: string | undefined;
                        val: any;
                        name: string;
                        key: string;
                    })[] | undefined;
                    override?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideStrategy?: "shift" | "swap" | undefined;
                    overrideSwap?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideShift?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    skip?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    strength?: number | undefined;
                    max?: number | undefined;
                    min?: number | undefined;
                    parentName?: string | undefined;
                    mask: (string & {}) | {
                        readonly [x: number]: string;
                        toString: () => string;
                        charAt: (pos: number) => string;
                        charCodeAt: (index: number) => number;
                        concat: (...strings: string[]) => string;
                        indexOf: (searchString: string, position?: number) => number;
                        lastIndexOf: (searchString: string, position?: number) => number;
                        localeCompare: {
                            (that: string): number;
                            (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                            (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                        };
                        match: {
                            (regexp: string | RegExp): RegExpMatchArray | null;
                            (matcher: {
                                [Symbol.match](string: string): RegExpMatchArray | null;
                            }): RegExpMatchArray | null;
                        };
                        replace: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replaceValue: string): string;
                            }, replaceValue: string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                            }, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        search: {
                            (regexp: string | RegExp): number;
                            (searcher: {
                                [Symbol.search](string: string): number;
                            }): number;
                        };
                        slice: (start?: number, end?: number) => string;
                        split: {
                            (separator: string | RegExp, limit?: number): string[];
                            (splitter: {
                                [Symbol.split](string: string, limit?: number): string[];
                            }, limit?: number): string[];
                        };
                        substring: (start: number, end?: number) => string;
                        toLowerCase: () => string;
                        toLocaleLowerCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        toUpperCase: () => string;
                        toLocaleUpperCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        trim: () => string;
                        readonly length: number;
                        substr: (from: number, length?: number) => string;
                        valueOf: () => string;
                        codePointAt: (pos: number) => number | undefined;
                        includes: (searchString: string, position?: number) => boolean;
                        endsWith: (searchString: string, endPosition?: number) => boolean;
                        normalize: {
                            (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                            (form?: string): string;
                        };
                        repeat: (count: number) => string;
                        startsWith: (searchString: string, position?: number) => boolean;
                        anchor: (name: string) => string;
                        big: () => string;
                        blink: () => string;
                        bold: () => string;
                        fixed: () => string;
                        fontcolor: (color: string) => string;
                        fontsize: {
                            (size: number): string;
                            (size: string): string;
                        };
                        italics: () => string;
                        link: (url: string) => string;
                        small: () => string;
                        strike: () => string;
                        sub: () => string;
                        sup: () => string;
                        padStart: (maxLength: number, fillString?: string) => string;
                        padEnd: (maxLength: number, fillString?: string) => string;
                        trimEnd: () => string;
                        trimStart: () => string;
                        trimLeft: () => string;
                        trimRight: () => string;
                        matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                        replaceAll: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        at: (index: number) => string | undefined;
                        isWellFormed: () => boolean;
                        toWellFormed: () => string;
                        [Symbol.iterator]: () => StringIterator<string>;
                    };
                    avoidNestingWithin?: string[] | undefined;
                    childOptions?: {
                        palette?: (string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        })[] | undefined;
                        override?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideStrategy?: "shift" | "swap" | undefined;
                        overrideSwap?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideShift?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        skip?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        strength?: number | undefined;
                        max?: number | undefined;
                        min?: number | undefined;
                        parentName?: string | undefined;
                        mask?: (string & {}) | {
                            readonly [x: number]: string;
                            toString: () => string;
                            charAt: (pos: number) => string;
                            charCodeAt: (index: number) => number;
                            concat: (...strings: string[]) => string;
                            indexOf: (searchString: string, position?: number) => number;
                            lastIndexOf: (searchString: string, position?: number) => number;
                            localeCompare: {
                                (that: string): number;
                                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                            };
                            match: {
                                (regexp: string | RegExp): RegExpMatchArray | null;
                                (matcher: {
                                    [Symbol.match](string: string): RegExpMatchArray | null;
                                }): RegExpMatchArray | null;
                            };
                            replace: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replaceValue: string): string;
                                }, replaceValue: string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                                }, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            search: {
                                (regexp: string | RegExp): number;
                                (searcher: {
                                    [Symbol.search](string: string): number;
                                }): number;
                            };
                            slice: (start?: number, end?: number) => string;
                            split: {
                                (separator: string | RegExp, limit?: number): string[];
                                (splitter: {
                                    [Symbol.split](string: string, limit?: number): string[];
                                }, limit?: number): string[];
                            };
                            substring: (start: number, end?: number) => string;
                            toLowerCase: () => string;
                            toLocaleLowerCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            toUpperCase: () => string;
                            toLocaleUpperCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            trim: () => string;
                            readonly length: number;
                            substr: (from: number, length?: number) => string;
                            valueOf: () => string;
                            codePointAt: (pos: number) => number | undefined;
                            includes: (searchString: string, position?: number) => boolean;
                            endsWith: (searchString: string, endPosition?: number) => boolean;
                            normalize: {
                                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                                (form?: string): string;
                            };
                            repeat: (count: number) => string;
                            startsWith: (searchString: string, position?: number) => boolean;
                            anchor: (name: string) => string;
                            big: () => string;
                            blink: () => string;
                            bold: () => string;
                            fixed: () => string;
                            fontcolor: (color: string) => string;
                            fontsize: {
                                (size: number): string;
                                (size: string): string;
                            };
                            italics: () => string;
                            link: (url: string) => string;
                            small: () => string;
                            strike: () => string;
                            sub: () => string;
                            sup: () => string;
                            padStart: (maxLength: number, fillString?: string) => string;
                            padEnd: (maxLength: number, fillString?: string) => string;
                            trimEnd: () => string;
                            trimStart: () => string;
                            trimLeft: () => string;
                            trimRight: () => string;
                            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                            replaceAll: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            at: (index: number) => string | undefined;
                            isWellFormed: () => boolean;
                            toWellFormed: () => string;
                            [Symbol.iterator]: () => StringIterator<string>;
                        } | undefined;
                    } | undefined;
                    parent: string;
                })[];
            } & {
                parent: "light";
            };
            [x: `dark_${string}`]: {
                [x: string]: {
                    theme: {
                        [x: string]: string;
                    };
                } | {
                    nonInheritedValues?: {
                        [x: string]: string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        };
                    } | undefined;
                    palette?: string | undefined;
                    template: string;
                } | {
                    palette?: (string | {
                        isVar: true;
                        variable?: string | undefined;
                        val: any;
                        name: string;
                        key: string;
                    })[] | undefined;
                    override?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideStrategy?: "shift" | "swap" | undefined;
                    overrideSwap?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideShift?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    skip?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    strength?: number | undefined;
                    max?: number | undefined;
                    min?: number | undefined;
                    parentName?: string | undefined;
                    mask: (string & {}) | {
                        readonly [x: number]: string;
                        toString: () => string;
                        charAt: (pos: number) => string;
                        charCodeAt: (index: number) => number;
                        concat: (...strings: string[]) => string;
                        indexOf: (searchString: string, position?: number) => number;
                        lastIndexOf: (searchString: string, position?: number) => number;
                        localeCompare: {
                            (that: string): number;
                            (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                            (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                        };
                        match: {
                            (regexp: string | RegExp): RegExpMatchArray | null;
                            (matcher: {
                                [Symbol.match](string: string): RegExpMatchArray | null;
                            }): RegExpMatchArray | null;
                        };
                        replace: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replaceValue: string): string;
                            }, replaceValue: string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                            }, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        search: {
                            (regexp: string | RegExp): number;
                            (searcher: {
                                [Symbol.search](string: string): number;
                            }): number;
                        };
                        slice: (start?: number, end?: number) => string;
                        split: {
                            (separator: string | RegExp, limit?: number): string[];
                            (splitter: {
                                [Symbol.split](string: string, limit?: number): string[];
                            }, limit?: number): string[];
                        };
                        substring: (start: number, end?: number) => string;
                        toLowerCase: () => string;
                        toLocaleLowerCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        toUpperCase: () => string;
                        toLocaleUpperCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        trim: () => string;
                        readonly length: number;
                        substr: (from: number, length?: number) => string;
                        valueOf: () => string;
                        codePointAt: (pos: number) => number | undefined;
                        includes: (searchString: string, position?: number) => boolean;
                        endsWith: (searchString: string, endPosition?: number) => boolean;
                        normalize: {
                            (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                            (form?: string): string;
                        };
                        repeat: (count: number) => string;
                        startsWith: (searchString: string, position?: number) => boolean;
                        anchor: (name: string) => string;
                        big: () => string;
                        blink: () => string;
                        bold: () => string;
                        fixed: () => string;
                        fontcolor: (color: string) => string;
                        fontsize: {
                            (size: number): string;
                            (size: string): string;
                        };
                        italics: () => string;
                        link: (url: string) => string;
                        small: () => string;
                        strike: () => string;
                        sub: () => string;
                        sup: () => string;
                        padStart: (maxLength: number, fillString?: string) => string;
                        padEnd: (maxLength: number, fillString?: string) => string;
                        trimEnd: () => string;
                        trimStart: () => string;
                        trimLeft: () => string;
                        trimRight: () => string;
                        matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                        replaceAll: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        at: (index: number) => string | undefined;
                        isWellFormed: () => boolean;
                        toWellFormed: () => string;
                        [Symbol.iterator]: () => StringIterator<string>;
                    };
                    avoidNestingWithin?: string[] | undefined;
                    childOptions?: {
                        palette?: (string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        })[] | undefined;
                        override?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideStrategy?: "shift" | "swap" | undefined;
                        overrideSwap?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideShift?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        skip?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        strength?: number | undefined;
                        max?: number | undefined;
                        min?: number | undefined;
                        parentName?: string | undefined;
                        mask?: (string & {}) | {
                            readonly [x: number]: string;
                            toString: () => string;
                            charAt: (pos: number) => string;
                            charCodeAt: (index: number) => number;
                            concat: (...strings: string[]) => string;
                            indexOf: (searchString: string, position?: number) => number;
                            lastIndexOf: (searchString: string, position?: number) => number;
                            localeCompare: {
                                (that: string): number;
                                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                            };
                            match: {
                                (regexp: string | RegExp): RegExpMatchArray | null;
                                (matcher: {
                                    [Symbol.match](string: string): RegExpMatchArray | null;
                                }): RegExpMatchArray | null;
                            };
                            replace: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replaceValue: string): string;
                                }, replaceValue: string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                                }, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            search: {
                                (regexp: string | RegExp): number;
                                (searcher: {
                                    [Symbol.search](string: string): number;
                                }): number;
                            };
                            slice: (start?: number, end?: number) => string;
                            split: {
                                (separator: string | RegExp, limit?: number): string[];
                                (splitter: {
                                    [Symbol.split](string: string, limit?: number): string[];
                                }, limit?: number): string[];
                            };
                            substring: (start: number, end?: number) => string;
                            toLowerCase: () => string;
                            toLocaleLowerCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            toUpperCase: () => string;
                            toLocaleUpperCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            trim: () => string;
                            readonly length: number;
                            substr: (from: number, length?: number) => string;
                            valueOf: () => string;
                            codePointAt: (pos: number) => number | undefined;
                            includes: (searchString: string, position?: number) => boolean;
                            endsWith: (searchString: string, endPosition?: number) => boolean;
                            normalize: {
                                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                                (form?: string): string;
                            };
                            repeat: (count: number) => string;
                            startsWith: (searchString: string, position?: number) => boolean;
                            anchor: (name: string) => string;
                            big: () => string;
                            blink: () => string;
                            bold: () => string;
                            fixed: () => string;
                            fontcolor: (color: string) => string;
                            fontsize: {
                                (size: number): string;
                                (size: string): string;
                            };
                            italics: () => string;
                            link: (url: string) => string;
                            small: () => string;
                            strike: () => string;
                            sub: () => string;
                            sup: () => string;
                            padStart: (maxLength: number, fillString?: string) => string;
                            padEnd: (maxLength: number, fillString?: string) => string;
                            trimEnd: () => string;
                            trimStart: () => string;
                            trimLeft: () => string;
                            trimRight: () => string;
                            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                            replaceAll: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            at: (index: number) => string | undefined;
                            isWellFormed: () => boolean;
                            toWellFormed: () => string;
                            [Symbol.iterator]: () => StringIterator<string>;
                        } | undefined;
                    } | undefined;
                } | ({
                    theme: {
                        [x: string]: string;
                    };
                    parent: string;
                } | {
                    nonInheritedValues?: {
                        [x: string]: string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        };
                    } | undefined;
                    palette?: string | undefined;
                    template: string;
                    parent: string;
                } | {
                    palette?: (string | {
                        isVar: true;
                        variable?: string | undefined;
                        val: any;
                        name: string;
                        key: string;
                    })[] | undefined;
                    override?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideStrategy?: "shift" | "swap" | undefined;
                    overrideSwap?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    overrideShift?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    skip?: {
                        [x: string]: string | number | undefined;
                    } | undefined;
                    strength?: number | undefined;
                    max?: number | undefined;
                    min?: number | undefined;
                    parentName?: string | undefined;
                    mask: (string & {}) | {
                        readonly [x: number]: string;
                        toString: () => string;
                        charAt: (pos: number) => string;
                        charCodeAt: (index: number) => number;
                        concat: (...strings: string[]) => string;
                        indexOf: (searchString: string, position?: number) => number;
                        lastIndexOf: (searchString: string, position?: number) => number;
                        localeCompare: {
                            (that: string): number;
                            (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                            (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                        };
                        match: {
                            (regexp: string | RegExp): RegExpMatchArray | null;
                            (matcher: {
                                [Symbol.match](string: string): RegExpMatchArray | null;
                            }): RegExpMatchArray | null;
                        };
                        replace: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replaceValue: string): string;
                            }, replaceValue: string): string;
                            (searchValue: {
                                [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                            }, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        search: {
                            (regexp: string | RegExp): number;
                            (searcher: {
                                [Symbol.search](string: string): number;
                            }): number;
                        };
                        slice: (start?: number, end?: number) => string;
                        split: {
                            (separator: string | RegExp, limit?: number): string[];
                            (splitter: {
                                [Symbol.split](string: string, limit?: number): string[];
                            }, limit?: number): string[];
                        };
                        substring: (start: number, end?: number) => string;
                        toLowerCase: () => string;
                        toLocaleLowerCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        toUpperCase: () => string;
                        toLocaleUpperCase: {
                            (locales?: string | string[]): string;
                            (locales?: Intl.LocalesArgument): string;
                        };
                        trim: () => string;
                        readonly length: number;
                        substr: (from: number, length?: number) => string;
                        valueOf: () => string;
                        codePointAt: (pos: number) => number | undefined;
                        includes: (searchString: string, position?: number) => boolean;
                        endsWith: (searchString: string, endPosition?: number) => boolean;
                        normalize: {
                            (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                            (form?: string): string;
                        };
                        repeat: (count: number) => string;
                        startsWith: (searchString: string, position?: number) => boolean;
                        anchor: (name: string) => string;
                        big: () => string;
                        blink: () => string;
                        bold: () => string;
                        fixed: () => string;
                        fontcolor: (color: string) => string;
                        fontsize: {
                            (size: number): string;
                            (size: string): string;
                        };
                        italics: () => string;
                        link: (url: string) => string;
                        small: () => string;
                        strike: () => string;
                        sub: () => string;
                        sup: () => string;
                        padStart: (maxLength: number, fillString?: string) => string;
                        padEnd: (maxLength: number, fillString?: string) => string;
                        trimEnd: () => string;
                        trimStart: () => string;
                        trimLeft: () => string;
                        trimRight: () => string;
                        matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                        replaceAll: {
                            (searchValue: string | RegExp, replaceValue: string): string;
                            (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                        };
                        at: (index: number) => string | undefined;
                        isWellFormed: () => boolean;
                        toWellFormed: () => string;
                        [Symbol.iterator]: () => StringIterator<string>;
                    };
                    avoidNestingWithin?: string[] | undefined;
                    childOptions?: {
                        palette?: (string | {
                            isVar: true;
                            variable?: string | undefined;
                            val: any;
                            name: string;
                            key: string;
                        })[] | undefined;
                        override?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideStrategy?: "shift" | "swap" | undefined;
                        overrideSwap?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        overrideShift?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        skip?: {
                            [x: string]: string | number | undefined;
                        } | undefined;
                        strength?: number | undefined;
                        max?: number | undefined;
                        min?: number | undefined;
                        parentName?: string | undefined;
                        mask?: (string & {}) | {
                            readonly [x: number]: string;
                            toString: () => string;
                            charAt: (pos: number) => string;
                            charCodeAt: (index: number) => number;
                            concat: (...strings: string[]) => string;
                            indexOf: (searchString: string, position?: number) => number;
                            lastIndexOf: (searchString: string, position?: number) => number;
                            localeCompare: {
                                (that: string): number;
                                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
                            };
                            match: {
                                (regexp: string | RegExp): RegExpMatchArray | null;
                                (matcher: {
                                    [Symbol.match](string: string): RegExpMatchArray | null;
                                }): RegExpMatchArray | null;
                            };
                            replace: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replaceValue: string): string;
                                }, replaceValue: string): string;
                                (searchValue: {
                                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                                }, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            search: {
                                (regexp: string | RegExp): number;
                                (searcher: {
                                    [Symbol.search](string: string): number;
                                }): number;
                            };
                            slice: (start?: number, end?: number) => string;
                            split: {
                                (separator: string | RegExp, limit?: number): string[];
                                (splitter: {
                                    [Symbol.split](string: string, limit?: number): string[];
                                }, limit?: number): string[];
                            };
                            substring: (start: number, end?: number) => string;
                            toLowerCase: () => string;
                            toLocaleLowerCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            toUpperCase: () => string;
                            toLocaleUpperCase: {
                                (locales?: string | string[]): string;
                                (locales?: Intl.LocalesArgument): string;
                            };
                            trim: () => string;
                            readonly length: number;
                            substr: (from: number, length?: number) => string;
                            valueOf: () => string;
                            codePointAt: (pos: number) => number | undefined;
                            includes: (searchString: string, position?: number) => boolean;
                            endsWith: (searchString: string, endPosition?: number) => boolean;
                            normalize: {
                                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                                (form?: string): string;
                            };
                            repeat: (count: number) => string;
                            startsWith: (searchString: string, position?: number) => boolean;
                            anchor: (name: string) => string;
                            big: () => string;
                            blink: () => string;
                            bold: () => string;
                            fixed: () => string;
                            fontcolor: (color: string) => string;
                            fontsize: {
                                (size: number): string;
                                (size: string): string;
                            };
                            italics: () => string;
                            link: (url: string) => string;
                            small: () => string;
                            strike: () => string;
                            sub: () => string;
                            sup: () => string;
                            padStart: (maxLength: number, fillString?: string) => string;
                            padEnd: (maxLength: number, fillString?: string) => string;
                            trimEnd: () => string;
                            trimStart: () => string;
                            trimLeft: () => string;
                            trimRight: () => string;
                            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
                            replaceAll: {
                                (searchValue: string | RegExp, replaceValue: string): string;
                                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                            };
                            at: (index: number) => string | undefined;
                            isWellFormed: () => boolean;
                            toWellFormed: () => string;
                            [Symbol.iterator]: () => StringIterator<string>;
                        } | undefined;
                    } | undefined;
                    parent: string;
                })[];
            } & {
                parent: "dark";
            };
        };
    } & {
        themes: {
            [x: `light_${string}`]: {
                [k: string]: {
                    template: string;
                };
            } & {
                parent: "light";
            };
            [x: `dark_${string}`]: {
                [k: string]: {
                    template: string;
                };
            } & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: {
                [k: string]: {
                    template: string;
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: {
                [k: string]: {
                    template: string;
                };
            } & {
                parent: `dark_${string}`;
            };
        };
    } & {
        themes: {
            [x: `light_${string}`]: any;
            [x: `dark_${string}`]: any;
            [x: `light_${string}_${string}`]: any;
            [x: `dark_${string}_${string}`]: any;
            [x: `light_${string}_${string}_${string}`]: any;
            [x: `dark_${string}_${string}_${string}`]: any;
        };
    }>;
};
export declare function createPalettes(palettes: BuildPalettes): Record<string, string[]>;
//# sourceMappingURL=v4.d.ts.map