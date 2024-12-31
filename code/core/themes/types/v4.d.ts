import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export type * from './types';
export { defaultTemplates } from './v4-defaultTemplates';
type SimpleThemeDefinitions<TemplateName extends string = string> = {
    [ComponentName: string]: TemplateName;
};
type SimplePaletteDefinitions = Record<string, string[]>;
type Colors = string[];
type ColorsByScheme = {
    light: Colors;
    dark: Colors;
};
type CreateThemeColors = {
    base: Colors | ColorsByScheme;
    accent?: Colors | ColorsByScheme;
};
export declare function createThemes<ComponentThemes extends SimpleThemeDefinitions>({ colors, componentThemes, }: {
    colors: CreateThemeColors;
    componentThemes?: ComponentThemes;
}): {
    themes: {
        [x: `light_${string}`]: {
            [x: string]: string;
        };
        [x: `dark_${string}`]: {
            [x: string]: string;
        };
        [x: `light_${string}_${string}`]: never;
        [x: `dark_${string}_${string}`]: never;
        [x: `light_${string}_${string}_${string}`]: never;
        [x: `dark_${string}_${string}_${string}`]: never;
        readonly light: {
            [x: string]: string;
        };
        readonly dark: {
            [x: string]: string;
        };
    };
    themeBuilder: import("@tamagui/theme-builder").ThemeBuilder<Omit<{
        palettes: SimplePaletteDefinitions;
    } & {
        templates: BuildTemplates;
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
            [x: `light_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "light";
            };
            [x: `dark_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `light_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}_${string}`;
            };
            [x: `dark_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}_${string}`;
            };
        };
    }>;
};
export declare function createThemesFromStudio(props: BuildThemeSuiteProps): {
    themes: {
        [x: `light_${string}`]: {
            [x: string]: string;
        };
        [x: `dark_${string}`]: {
            [x: string]: string;
        };
        [x: `light_${string}_${string}`]: never;
        [x: `dark_${string}_${string}`]: never;
        [x: `light_${string}_${string}_${string}`]: never;
        [x: `dark_${string}_${string}_${string}`]: never;
        readonly light: {
            [x: string]: string;
        };
        readonly dark: {
            [x: string]: string;
        };
    };
    themeBuilder: import("@tamagui/theme-builder").ThemeBuilder<Omit<{
        palettes: SimplePaletteDefinitions;
    } & {
        templates: BuildTemplates;
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
            [x: `light_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "light";
            };
            [x: `dark_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `light_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}_${string}`;
            };
            [x: `dark_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}_${string}`;
            };
        };
    }>;
};
export declare function buildThemes<Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, ComponentThemes extends SimpleThemeDefinitions<keyof Templates extends string ? keyof Templates : string>>({ templates, palettes, componentThemes, }: {
    palettes?: Palettes;
    templates?: Templates;
    componentThemes?: ComponentThemes;
}): {
    themes: {
        [x: `light_${string}`]: "base" extends infer T ? T extends "base" ? T extends keyof Templates ? Templates[T] extends infer T_1 ? { [key in keyof T_1]: string; } : never : {
            template: T;
        } & {
            readonly template: "base";
            readonly palette: "light";
        } : never : never;
        [x: `dark_${string}`]: "base" extends infer T_2 ? T_2 extends "base" ? T_2 extends keyof Templates ? Templates[T_2] extends infer T_3 ? { [key_1 in keyof T_3]: string; } : never : {
            template: T_2;
        } & {
            readonly template: "base";
            readonly palette: "dark";
        } : never : never;
        [x: `light_${string}_${string}`]: never;
        [x: `dark_${string}_${string}`]: never;
        [x: `light_${string}_${string}_${string}`]: never;
        [x: `dark_${string}_${string}_${string}`]: never;
        readonly light: "base" extends infer T_4 ? T_4 extends "base" ? T_4 extends keyof Templates ? Templates[T_4] extends infer T_5 ? { [key_2 in keyof T_5]: string; } : never : {
            template: T_4;
        } & {
            readonly template: "base";
            readonly palette: "light";
        } : never : never;
        readonly dark: "base" extends infer T_6 ? T_6 extends "base" ? T_6 extends keyof Templates ? Templates[T_6] extends infer T_7 ? { [key_3 in keyof T_7]: string; } : never : {
            template: T_6;
        } & {
            readonly template: "base";
            readonly palette: "dark";
        } : never : never;
    };
    themeBuilder: import("@tamagui/theme-builder").ThemeBuilder<Omit<{
        palettes: Palettes;
    } & {
        templates: Templates;
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
            [x: `light_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "light";
            };
            [x: `dark_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}`;
            };
            [x: `light_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `light_${string}_${string}`;
            };
            [x: `dark_${string}_${string}_${string}`]: {
                [k: string]: {
                    parent: string;
                    template: string;
                };
            } & {
                parent: `dark_${string}_${string}`;
            };
        };
    }>;
};
export declare const getComponentThemes: (components: SimpleThemeDefinitions) => {
    [k: string]: {
        parent: string;
        template: string;
    };
};
export declare const defaultComponentThemes: {
    readonly ListItem: "surface1";
    readonly SelectTrigger: "surface1";
    readonly Card: "surface1";
    readonly Button: "surface3";
    readonly Checkbox: "surface2";
    readonly Switch: "surface2";
    readonly SwitchThumb: "inverseSurface1";
    readonly TooltipContent: "surface2";
    readonly Progress: "surface1";
    readonly RadioGroupItem: "surface2";
    readonly TooltipArrow: "surface1";
    readonly SliderTrackActive: "surface3";
    readonly SliderTrack: "surface1";
    readonly SliderThumb: "inverseSurface1";
    readonly Tooltip: "inverseSurface1";
    readonly ProgressIndicator: "inverseSurface1";
    readonly Input: "surface1";
    readonly TextArea: "surface1";
};
export declare function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions;
//# sourceMappingURL=v4.d.ts.map