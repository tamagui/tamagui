import type { ContextData, FloatingContext, ReferenceType } from '@floating-ui/react-dom-interactions';
import type { MediaPropKeys, SizeTokens } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import type { ThemeableStackProps, YStackProps } from '@tamagui/stacks';
import type { DispatchWithoutAction, HTMLProps, MutableRefObject, ReactNode } from 'react';
export declare type Direction = 'ltr' | 'rtl';
export declare type ScopedProps<P> = P & {
    __scopeSelect?: Scope;
};
export interface SelectProps {
    id?: string;
    children?: ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?(value: string): void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    name?: string;
    autoComplete?: string;
    size?: SizeTokens;
    sheetBreakpoint?: MediaPropKeys | false;
}
declare type NonNull<A> = Exclude<A, void | null>;
export interface SelectContextValue {
    dir?: Direction;
    scopeKey: string;
    sheetBreakpoint: NonNull<SelectProps['sheetBreakpoint']>;
    size?: SizeTokens;
    value: any;
    selectedItem: ReactNode;
    setSelectedItem: (item: ReactNode) => void;
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    activeIndex: number | null;
    setActiveIndex: (index: number | null) => void;
    setValueAtIndex: (index: number, value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    onChange: (value: string) => void;
    valueNode: Element | null;
    onValueNodeChange(node: HTMLElement): void;
    valueNodeHasChildren: boolean;
    onValueNodeHasChildrenChange(hasChildren: boolean): void;
    forceUpdate: DispatchWithoutAction;
    fallback: boolean;
    blockSelection: boolean;
    allowSelectRef?: MutableRefObject<boolean>;
    allowMouseUpRef?: MutableRefObject<boolean>;
    upArrowRef?: MutableRefObject<HTMLDivElement | null>;
    downArrowRef?: MutableRefObject<HTMLDivElement | null>;
    selectTimeoutRef?: MutableRefObject<any>;
    setScrollTop?: Function;
    setInnerOffset?: Function;
    dataRef?: MutableRefObject<ContextData>;
    controlledScrolling?: boolean;
    listRef?: MutableRefObject<Array<HTMLElement | null>>;
    floatingRef?: MutableRefObject<HTMLElement | null>;
    canScrollUp?: boolean;
    canScrollDown?: boolean;
    floatingContext?: FloatingContext<ReferenceType>;
    interactions?: {
        getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => any;
        getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
        getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
    };
}
export declare type SelectViewportProps = ThemeableStackProps & {
    size?: SizeTokens;
};
export declare type SelectContentProps = ScopedProps<{
    children?: React.ReactNode;
}>;
export interface SelectScrollButtonImplProps extends YStackProps {
    dir: 'up' | 'down';
    componentName: string;
}
export interface SelectScrollButtonProps extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {
}
export {};
//# sourceMappingURL=types.d.ts.map