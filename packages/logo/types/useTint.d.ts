/// <reference types="react" />
export declare const initialTint = 3;
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare const useTint: () => {
    readonly tints: ThemeName[];
    readonly tintIndex: number;
    readonly tint: ThemeName;
    readonly setTintIndex: (next: number) => void;
    readonly setNextTintFamily: () => void;
    readonly setNextTint: () => void;
    readonly name: "tamagui" | "xmas";
    readonly families: {
        tamagui: ThemeName[];
        xmas: ThemeName[];
    };
};
export declare const ThemeTint: (props: {
    children: any;
    disable?: boolean;
}) => JSX.Element;
//# sourceMappingURL=useTint.d.ts.map