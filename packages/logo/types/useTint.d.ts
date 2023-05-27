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
    readonly name: "tamagui" | "xmas" | "easter";
    readonly families: {
        tamagui: string[];
        xmas: string[];
        easter: string[];
    };
};
export declare const ThemeTint: (props: {
    children: any;
    disable?: boolean;
}) => JSX.Element;
export declare const ThemeTintAlt: ({ children, disable, offset, }: {
    children: any;
    disable?: boolean | undefined;
    offset?: number | undefined;
}) => JSX.Element;
//# sourceMappingURL=useTint.d.ts.map