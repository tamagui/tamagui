import React from 'react';
declare type MenuProps = {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    trigger?: any;
    onChangeOpen?: (next: boolean) => void;
};
export declare const Menu: (({ children, open, defaultOpen, trigger, onChangeOpen }: MenuProps) => JSX.Element | null) & {
    Item: (props: any) => any;
    Provider: ({ children, }: import("@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types").BottomSheetModalProviderProps) => JSX.Element;
};
export {};
//# sourceMappingURL=Menu.d.ts.map