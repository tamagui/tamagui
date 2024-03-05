import type { ThemeProps } from 'tamagui';
export declare const initialTint = 3;
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare const useTint: (altOffset?: number) => {
    readonly tints: string[];
    readonly tintIndex: number;
    readonly tintAltIndex: number;
    readonly tint: string;
    readonly tintAlt: string;
    readonly setTintIndex: (next: number) => void;
    readonly setNextTintFamily: () => void;
    readonly setNextTint: () => void;
    readonly name: "tamagui" | "xmas" | "easter" | "halloween" | "valentine" | "lunar";
    readonly families: {
        tamagui: string[];
        xmas: string[];
        easter: string[];
        halloween: string[];
        valentine: string[];
        lunar: string[];
    };
};
export declare const ThemeTint: ({ disable, children, ...rest }: ThemeProps & {
    disable?: boolean | undefined;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ThemeTintAlt: ({ children, disable, offset, ...rest }: ThemeProps & {
    disable?: boolean | undefined;
    offset?: number | undefined;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=useTint.d.ts.map