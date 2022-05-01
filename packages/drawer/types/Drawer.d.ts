import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { ThemeName } from '@tamagui/core';
import React from 'react';
export declare const Drawer: ((props: Omit<Omit<Partial<BottomSheetModalProps>, "onChange"> & {
    theme?: ThemeName | undefined;
    open?: boolean | undefined;
    onChange?: React.Dispatch<React.SetStateAction<boolean>> | ((showing: boolean) => void) | undefined;
    showHandle?: boolean | undefined;
    hideBackground?: boolean | undefined;
}, "theme" | "themeInverse"> & {
    theme?: ThemeName | null | undefined;
    themeInverse?: boolean | undefined;
}) => JSX.Element) & {
    Provider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
    Panel: import("@tamagui/core").TamaguiComponent<unknown, any, unknown, {}>;
};
//# sourceMappingURL=Drawer.d.ts.map