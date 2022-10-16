import React from 'react';
declare type MenuProps = {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    trigger?: any;
    onOpenChange?: (next: boolean) => void;
};
export declare const Menu: (({ children, open, defaultOpen, trigger, onOpenChange }: MenuProps) => null) & {
    Item: (props: any) => any;
};
export {};
//# sourceMappingURL=Menu.d.ts.map