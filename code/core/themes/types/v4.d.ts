import type { BuildPalettes, BuildThemeSuiteProps } from './types';
export type * from './types';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export declare function createThemes(props: BuildThemeSuiteProps): {
    themes: {
        [x: `light_${string}`]: {
            [x: string]: string;
        };
        [x: `dark_${string}`]: {
            [x: string]: string;
        };
        [x: `light_${string}_alt1`]: never;
        [x: `light_${string}_alt2`]: never;
        [x: `light_${string}_active`]: never;
        [x: `light_${string}_surface1`]: never;
        [x: `light_${string}_surface2`]: never;
        [x: `light_${string}_surface3`]: never;
        [x: `light_${string}_surface4`]: never;
        [x: `dark_${string}_alt1`]: never;
        [x: `dark_${string}_alt2`]: never;
        [x: `dark_${string}_active`]: never;
        [x: `dark_${string}_surface1`]: never;
        [x: `dark_${string}_surface2`]: never;
        [x: `dark_${string}_surface3`]: never;
        [x: `dark_${string}_surface4`]: never;
        [x: `light_${string}_${string}`]: never;
        [x: `dark_${string}_${string}`]: never;
        [x: `light_${string}_alt1_${string}`]: never;
        [x: `light_${string}_alt2_${string}`]: never;
        [x: `light_${string}_active_${string}`]: never;
        [x: `light_${string}_surface1_${string}`]: never;
        [x: `light_${string}_surface2_${string}`]: never;
        [x: `light_${string}_surface3_${string}`]: never;
        [x: `light_${string}_surface4_${string}`]: never;
        [x: `dark_${string}_alt1_${string}`]: never;
        [x: `dark_${string}_alt2_${string}`]: never;
        [x: `dark_${string}_active_${string}`]: never;
        [x: `dark_${string}_surface1_${string}`]: never;
        [x: `dark_${string}_surface2_${string}`]: never;
        [x: `dark_${string}_surface3_${string}`]: never;
        [x: `dark_${string}_surface4_${string}`]: never;
        readonly light: {
            [x: string]: string;
        };
        readonly dark: {
            [x: string]: string;
        };
        light_alt1: {
            [x: string]: string;
        };
        light_alt2: {
            [x: string]: string;
        };
        light_active: {
            [x: string]: string;
        };
        dark_alt1: {
            [x: string]: string;
        };
        dark_alt2: {
            [x: string]: string;
        };
        dark_active: {
            [x: string]: string;
        };
        light_surface1: {
            [x: string]: string;
        };
        light_surface2: {
            [x: string]: string;
        };
        light_surface3: {
            [x: string]: string;
        };
        dark_surface1: {
            [x: string]: string;
        };
        dark_surface2: {
            [x: string]: string;
        };
        dark_surface3: {
            [x: string]: string;
        };
        light_surface4: {
            [x: string]: string;
        };
        dark_surface4: {
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
            [x: `light_${string}_alt1`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_alt2`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_active`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_surface1`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_surface2`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_surface3`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `light_${string}_surface4`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_alt1`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_alt2`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_active`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_surface1`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_surface2`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_surface3`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `dark_${string}_surface4`]: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: `dark_${string}`;
            };
            light_alt1: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            light_alt2: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            light_active: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            dark_alt1: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            dark_alt2: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            dark_active: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            light_surface1: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            light_surface2: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            light_surface3: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            dark_surface1: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            dark_surface2: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            dark_surface3: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
            light_surface4: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "light";
            };
            dark_surface4: {
                readonly alt1: {
                    readonly template: "alt1";
                };
                readonly alt2: {
                    readonly template: "alt2";
                };
                readonly active: {
                    readonly template: "surface3";
                };
                readonly surface1: {
                    readonly template: "surface1";
                };
                readonly surface2: {
                    readonly template: "surface2";
                };
                readonly surface3: {
                    readonly template: "surface3";
                };
                readonly surface4: {
                    readonly template: "surfaceActive";
                };
            } & {
                parent: "dark";
            };
        };
    } & {
        themes: {
            [x: `light_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: "light";
            };
            [x: `dark_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}`;
            };
            [x: `light_${string}_alt1_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_alt1`;
            };
            [x: `light_${string}_alt2_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_alt2`;
            };
            [x: `light_${string}_active_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_active`;
            };
            [x: `light_${string}_surface1_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_surface1`;
            };
            [x: `light_${string}_surface2_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_surface2`;
            };
            [x: `light_${string}_surface3_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_surface3`;
            };
            [x: `light_${string}_surface4_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `light_${string}_surface4`;
            };
            [x: `dark_${string}_alt1_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_alt1`;
            };
            [x: `dark_${string}_alt2_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_alt2`;
            };
            [x: `dark_${string}_active_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_active`;
            };
            [x: `dark_${string}_surface1_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_surface1`;
            };
            [x: `dark_${string}_surface2_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_surface2`;
            };
            [x: `dark_${string}_surface3_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_surface3`;
            };
            [x: `dark_${string}_surface4_${string}`]: import("@tamagui/theme-builder").ThemeDefinitions & {
                parent: `dark_${string}_surface4`;
            };
        };
    }>;
};
export declare function createPalettes(palettes: BuildPalettes): Record<string, string[]>;
//# sourceMappingURL=v4.d.ts.map