/// <reference types="react" />
import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
export declare const Drawer: (({ children, open, onChange, showHandle, ...props }: Omit<Partial<BottomSheetModalProps>, "onChange"> & {
    open?: boolean | undefined;
    onChange?: import("react").Dispatch<import("react").SetStateAction<boolean>> | ((showing: boolean) => void) | undefined;
    showHandle?: boolean | undefined;
}) => JSX.Element) & {
    Provider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
};
//# sourceMappingURL=Drawer.d.ts.map