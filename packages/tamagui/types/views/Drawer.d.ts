/// <reference types="react" />
import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
export declare const DrawerProvider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
export declare const Drawer: (({ children, open, ...props }: Partial<BottomSheetModalProps> & {
    open?: boolean | undefined;
}) => JSX.Element) & {
    Provider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
};
//# sourceMappingURL=Drawer.d.ts.map