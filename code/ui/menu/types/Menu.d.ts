import type React from 'react';
type MenuProps = {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    trigger?: any;
    onOpenChange?: (next: boolean) => void;
};
export declare const Menu: (({ children, open: openProp, defaultOpen, trigger, onOpenChange }: MenuProps) => null) & {
    Item: (props: any) => any;
};
export {};
//# sourceMappingURL=Menu.d.ts.map