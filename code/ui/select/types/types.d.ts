import type { ContextData, FloatingContext, ReferenceType } from '@floating-ui/react';
import type { NativeValue, SizeTokens } from '@tamagui/core';
import type { ThemeableStackProps, YStackProps } from '@tamagui/stacks';
import type { DispatchWithoutAction, HTMLProps, MutableRefObject, ReactNode } from 'react';
export type SelectDirection = 'ltr' | 'rtl';
export type SelectScopes = string;
export type SelectScopedProps<P> = P & {
    scope?: SelectScopes;
};
export type SelectImplProps = SelectScopedProps<SelectProps> & {
    activeIndexRef: any;
    selectedIndexRef: any;
    listContentRef: any;
};
export interface SelectProps<Value extends string = string> {
    id?: string;
    children?: ReactNode;
    value?: Value;
    defaultValue?: Value;
    onValueChange?(value: Value): void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: SelectDirection;
    name?: string;
    autoComplete?: string;
    size?: SizeTokens;
    /**
     * If passed, will render a native component instead of the custom one. Currently only `web` is supported.
     */
    native?: NativeValue<'web'>;
    /**
     * When true, avoids removing the scrollbar from the body when open
     */
    disablePreventBodyScroll?: boolean;
    /**
     * Called when an item is hovered by mouse or navigated to by keyboard.
     */
    onActiveChange?(value: string, index: number): void;
    /**
     * Render function for the selected value. Use this for SSR support.
     * When provided, this is called synchronously during render to display
     * the selected value, avoiding hydration mismatches.
     *
     * @example
     * ```tsx
     * <Select
     *   defaultValue="apple"
     *   renderValue={(value) => ({ apple: 'Apple', orange: 'Orange' }[value])}
     * >
     * ```
     */
    renderValue?(value: Value): ReactNode;
}
type DisposeFn = () => void;
export type EmitterSubscriber<Val> = (cb: (val: Val) => void) => DisposeFn;
export interface SelectItemParentContextValue {
    adaptScope: string;
    scopeName: string;
    id?: string;
    initialValue?: any;
    setSelectedIndex: (index: number) => void;
    listRef?: MutableRefObject<Array<HTMLElement | null>>;
    setOpen: (open: boolean) => void;
    onChange: (value: string) => void;
    onActiveChange: (value: string, index: number) => void;
    activeIndexSubscribe: EmitterSubscriber<number>;
    valueSubscribe: EmitterSubscriber<any>;
    allowSelectRef?: MutableRefObject<boolean>;
    allowMouseUpRef?: MutableRefObject<boolean>;
    setValueAtIndex: (index: number, value: string) => void;
    selectTimeoutRef?: MutableRefObject<any>;
    dataRef?: MutableRefObject<ContextData>;
    interactions?: {
        getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => any;
        getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
        getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
    };
    shouldRenderWebNative?: boolean;
    size?: SizeTokens;
}
export interface SelectContextValue {
    dir?: SelectDirection;
    scopeName: string;
    adaptScope: string;
    value: any;
    selectedItem: ReactNode;
    setSelectedItem: (item: ReactNode) => void;
    selectedIndex: number;
    activeIndex: number | null;
    setActiveIndex: (index: number | null) => void;
    open: boolean;
    valueNode: Element | null;
    onValueNodeChange(node: HTMLElement): void;
    forceUpdate: DispatchWithoutAction;
    isInSheet?: boolean;
    fallback: boolean;
    blockSelection: boolean;
    upArrowRef?: MutableRefObject<HTMLDivElement | null>;
    downArrowRef?: MutableRefObject<HTMLDivElement | null>;
    setScrollTop?: Function;
    setInnerOffset?: Function;
    controlledScrolling?: boolean;
    canScrollUp?: boolean;
    canScrollDown?: boolean;
    floatingContext?: FloatingContext<ReferenceType>;
    native?: NativeValue;
    disablePreventBodyScroll?: boolean;
    /** update floating-ui to recalculate */
    update?: () => void;
    /** Render function for the selected value (SSR support) */
    renderValue?: (value: any) => ReactNode;
}
export type SelectViewportExtraProps = SelectScopedProps<{
    size?: SizeTokens;
    disableScroll?: boolean;
    unstyled?: boolean;
}>;
export type SelectViewportProps = ThemeableStackProps & SelectViewportExtraProps;
export type SelectContentProps = SelectScopedProps<{
    children?: React.ReactNode;
    zIndex?: number;
}>;
export type SelectScrollButtonImplProps = YStackProps & SelectScopedProps<{
    dir: 'up' | 'down';
    componentName: string;
}>;
export interface SelectScrollButtonProps extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {
}
export {};
//# sourceMappingURL=types.d.ts.map