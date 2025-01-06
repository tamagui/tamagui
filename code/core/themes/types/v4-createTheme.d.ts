import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types';
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes';
export type * from './types';
export { defaultTemplates } from './v4-defaultTemplates';
type SimpleThemeDefinition = {
    colors?: ColorDefs;
    template?: string;
};
type BaseThemeDefinition = {
    colors: ColorDefs;
    template?: string;
};
type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>;
type SimplePaletteDefinitions = Record<string, string[]>;
type Colors = string[];
type ColorsByScheme = {
    light: Colors;
    dark: Colors;
};
type ColorDefs = Colors | ColorsByScheme;
export type CreateThemesProps<SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition> = {
    base: BaseThemeDefinition;
    accent: BaseThemeDefinition;
    subThemes?: SubThemes;
    templates?: BuildTemplates;
    componentThemes?: ComponentThemes;
    colorsToTheme?: (props: {
        colors: string[];
        name: string;
        scheme?: 'light' | 'dark';
    }) => Record<string, string>;
};
export declare function createThemes<SubThemes extends SimpleThemesDefinition, ComponentThemes extends SimpleThemesDefinition>(props: CreateThemesProps<SubThemes, ComponentThemes>): {
    [x: `light_${string}`]: any;
    [x: `dark_${string}`]: any;
    [x: `light_${string}_${string}`]: any;
    [x: `dark_${string}_${string}`]: any;
    readonly light: {
        [x: string]: string;
    };
    readonly dark: {
        [x: string]: string;
    };
};
export declare function createThemesFromStudio(props: BuildThemeSuiteProps): {
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
            [x: `light_${string}`]: Record<string, {
                template: string;
                palette?: string;
            }> & {
                parent: "light";
            };
            [x: `dark_${string}`]: Record<string, {
                template: string;
                palette?: string;
            }> & {
                parent: "dark";
            };
            [x: `light_${string}_${string}`]: Record<string, {
                template: string;
                palette?: string;
            }> & {
                parent: `light_${string}`;
            };
            [x: `dark_${string}_${string}`]: Record<string, {
                template: string;
                palette?: string;
            }> & {
                parent: `dark_${string}`;
            };
        };
    }>;
    themes: {
        [x: `light_${string}`]: {
            [x: string]: string;
        };
        [x: `dark_${string}`]: {
            [x: string]: string;
        };
        [x: `light_${string}_${string}`]: never;
        [x: `dark_${string}_${string}`]: never;
        readonly light: {
            [x: string]: string;
        };
        readonly dark: {
            [x: string]: string;
        };
    };
};
export declare function createBuilder<Templates extends BuildTemplates, Palettes extends SimplePaletteDefinitions, SubThemes extends Record<string, {
    template: keyof Templates extends string ? keyof Templates : never;
    palette?: string;
}>, ComponentThemes extends SimpleThemesDefinition>({ subThemes, templates, palettes, componentThemes, }: {
    palettes?: Palettes;
    templates?: Templates;
    subThemes?: SubThemes;
    componentThemes?: ComponentThemes;
}): import("@tamagui/theme-builder").ThemeBuilder<Omit<{
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
    themes: { [key in `light_${Exclude<keyof SubThemes, number | symbol>}` | `dark_${Exclude<keyof SubThemes, number | symbol>}` | `light_${string}_${Exclude<keyof SubThemes, number | symbol>}` | `dark_${string}_${Exclude<keyof SubThemes, number | symbol>}`]: SubThemes & {
        parent: key extends `${infer A}_${infer B}_${infer C}_${infer D}_${string}` ? `${A}_${B}_${C}_${D}` : key extends `${infer A_1}_${infer B_1}_${infer C_1}_${string}` ? `${A_1}_${B_1}_${C_1}` : key extends `${infer A_2}_${infer B_2}_${string}` ? `${A_2}_${B_2}` : key extends `${infer A_3}_${string}` ? `${A_3}` : never;
    }; };
}>;
export declare const getComponentThemes: (components: SimpleThemesDefinition) => {
    [k: string]: {
        parent: string;
        template: string;
    };
};
export declare const defaultComponentThemes: {
    ListItem: {
        template: string;
    };
    SelectTrigger: {
        template: string;
    };
    Card: {
        template: string;
    };
    Button: {
        template: string;
    };
    Checkbox: {
        template: string;
    };
    Switch: {
        template: string;
    };
    SwitchThumb: {
        template: string;
    };
    TooltipContent: {
        template: string;
    };
    Progress: {
        template: string;
    };
    RadioGroupItem: {
        template: string;
    };
    TooltipArrow: {
        template: string;
    };
    SliderTrackActive: {
        template: string;
    };
    SliderTrack: {
        template: string;
    };
    SliderThumb: {
        template: string;
    };
    Tooltip: {
        template: string;
    };
    ProgressIndicator: {
        template: string;
    };
    Input: {
        template: string;
    };
    TextArea: {
        template: string;
    };
};
export declare function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions;
//# sourceMappingURL=v4-createTheme.d.ts.map