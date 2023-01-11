/// <reference types="react" />
export declare const initialTint = 3;
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare const useTint: () => {
    readonly tints: string[];
    readonly tintIndex: number;
    readonly tint: string;
    readonly setTintIndex: (next: number) => void;
    readonly setNextTintFamily: () => void;
    readonly setNextTint: () => void;
    readonly name: "tamagui" | "xmas";
    readonly families: {
        tamagui: string[];
        xmas: string[];
    };
};
export declare const ThemeTint: (props: {
    children: any;
    disable?: boolean;
}) => JSX.Element;
//# sourceMappingURL=useTint.d.ts.map