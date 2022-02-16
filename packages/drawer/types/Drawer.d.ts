import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
import React from 'react';
export declare const Drawer: (({ children, open, onChange, showHandle, hideBackground, ...props }: Omit<Partial<BottomSheetModalProps>, "onChange"> & {
    open?: boolean | undefined;
    onChange?: React.Dispatch<React.SetStateAction<boolean>> | ((showing: boolean) => void) | undefined;
    showHandle?: boolean | undefined;
    hideBackground?: boolean | undefined;
}) => JSX.Element) & {
    Provider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
};
//# sourceMappingURL=Drawer.d.ts.map