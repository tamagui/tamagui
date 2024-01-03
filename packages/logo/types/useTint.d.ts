/// <reference types="react" />
import { ThemeProps } from 'tamagui';
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
    readonly name: "tamagui" | "xmas" | "easter" | "halloween";
    readonly families: {
        tamagui: string[];
        xmas: string[];
        easter: string[];
        halloween: string[];
    };
};
export declare const ThemeTint: ({ disable, children, ...rest }: ThemeProps & {
    disable?: boolean | undefined;
}) => JSX.Element;
export declare const ThemeTintAlt: ({ children, disable, offset, ...rest }: ThemeProps & {
    disable?: boolean | undefined;
    offset?: number | undefined;
}) => JSX.Element;
//# sourceMappingURL=useTint.d.ts.map