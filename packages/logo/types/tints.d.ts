declare const families: {
    tamagui: string[];
    xmas: string[];
};
type TintFamily = keyof typeof families;
export declare function getTints(): {
    name: "tamagui" | "xmas";
    tints: string[];
    families: {
        tamagui: string[];
        xmas: string[];
    };
};
export declare function useTints(): {
    name: "tamagui" | "xmas";
    tints: string[];
    families: {
        tamagui: string[];
        xmas: string[];
    };
};
export declare const setTintFamily: (next: TintFamily) => void;
export declare const setNextTintFamily: () => void;
type ChangeHandler = (next: TintFamily) => void;
export declare const onTintFamilyChange: (cb: ChangeHandler) => () => void;
export {};
//# sourceMappingURL=tints.d.ts.map