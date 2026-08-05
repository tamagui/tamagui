export declare const STYLE_TOKEN_PROVENANCE_KEY = "tamagui.styleTokenProvenance";
export type StyleTokenBinding = {
    /** original token string before resolution, e.g. '$background' or '$color9' */
    token: string;
    /** full resolved theme name that produced the value, e.g. 'light_accent' */
    theme: string;
};
export type StyleTokenProvenance = Record<string, StyleTokenBinding>;
export declare function setStyleTokenProvenance(style: object, provenance: StyleTokenProvenance): void;
export declare function getStyleTokenProvenance(style: object | null | undefined): StyleTokenProvenance | undefined;
//# sourceMappingURL=styleProvenance.d.ts.map