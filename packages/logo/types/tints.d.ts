type ChangeHandler = (next: TintFamily) => void;
declare const families: {
    tamagui: string[];
    xmas: string[];
    easter: string[];
    halloween: string[];
    valentine: string[];
    lunar: string[];
};
type TintFamily = keyof typeof families;
export declare function getTints(): {
    name: "tamagui" | "xmas" | "easter" | "halloween" | "valentine" | "lunar";
    tints: string[];
    families: {
        tamagui: string[];
        xmas: string[];
        easter: string[];
        halloween: string[];
        valentine: string[];
        lunar: string[];
    };
};
export declare function useTints(): {
    name: "tamagui" | "xmas" | "easter" | "halloween" | "valentine" | "lunar";
    tints: string[];
    families: {
        tamagui: string[];
        xmas: string[];
        easter: string[];
        halloween: string[];
        valentine: string[];
        lunar: string[];
    };
};
export declare function setTintFamily(next: TintFamily): void;
export declare const setNextTintFamily: () => void;
export declare const onTintFamilyChange: (cb: ChangeHandler) => () => void;
export {};
//# sourceMappingURL=tints.d.ts.map