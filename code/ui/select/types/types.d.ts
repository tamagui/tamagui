import type { NativeValue, SizeTokens, TamaguiChangeEventDetails, TamaguiEventDetails, ViewProps } from '@tamagui/core';
import type { DismissableProps } from '@tamagui/dismissable';
import type { HTMLProps, MutableRefObject, ReactNode, RefObject } from 'react';
import type { SelectItemRegistry, SelectMode, SelectSelection } from './selectionController';
type ContextData = Record<string, any>;
type ReferenceType = Element;
type FloatingContext<RT = ReferenceType> = {
    refs: {
        reference: RefObject<RT | null>;
        floating: RefObject<HTMLElement | null>;
        setFloating: (el: HTMLElement | null) => void;
        setReference: (el: RT | null) => void;
        [key: string]: any;
    };
    dataRef: RefObject<ContextData>;
    update?: () => void;
    [key: string]: any;
};
export type SelectDirection = 'ltr' | 'rtl';
export type SelectScopes = string;
export type SelectScopedProps<P> = P & {
    scope?: SelectScopes;
};
export type SelectValueForMode<Value extends string = string, Multiple extends boolean | undefined = false> = Multiple extends true ? Value[] : Multiple extends false | undefined ? Value : Value | Value[];
export type SelectValueChangeDetails = TamaguiChangeEventDetails<'item-press' | 'keyboard' | 'native-change'>;
export type SelectOpenChangeDetails = TamaguiChangeEventDetails<'trigger-press' | 'keyboard' | 'outside-press' | 'escape-key' | 'item-press'>;
export type SelectActiveChangeDetails = TamaguiEventDetails<'item-hover' | 'list-navigation' | 'keyboard', unknown, {
    index: number;
}>;
export type SelectImplProps = SelectScopedProps<SelectProps<string, boolean>> & {
    activeIndexRef: any;
    selectedIndexRef: any;
    listContentRef: any;
    /** fast setter: updates ref + emits to subscribers (no re-render) - use for hover/navigation */
    setActiveIndexFast: (index: number | null) => void;
};
export interface SelectProps<Value extends string = string, Multiple extends boolean | undefined = false> {
    id?: string;
    children?: ReactNode;
    multiple?: Multiple;
    value?: SelectValueForMode<Value, Multiple>;
    defaultValue?: SelectValueForMode<Value, Multiple>;
    onValueChange?(value: SelectValueForMode<Value, Multiple>, details: SelectValueChangeDetails): void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean, details: SelectOpenChangeDetails): void;
    dir?: SelectDirection;
    size?: SizeTokens | true;
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
    onActiveChange?(value: string, details: SelectActiveChangeDetails): void;
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
    renderValue?(value: SelectValueForMode<Value, Multiple>): ReactNode;
    /** web form field name. inert on react native. */
    name?: string;
    /** associates the web form control with an external form. inert on react native. */
    form?: string;
    /**
     * When true, defers mounting Select items until opened using startTransition.
     * This significantly improves initial render performance for pages with many Selects.
     *
     * Should be combined with `renderValue` to display the selected value during SSR
     * and before items are mounted.
     *
     * @default false
     */
    lazyMount?: boolean;
    /**
     * z-index for the select portal. Use this when select dropdowns need to appear
     * above other portaled content like dialogs or fixed headers.
     */
    zIndex?: number;
}
type DisposeFn = () => void;
export type EmitterSubscriber<Val> = (cb: (val: Val) => void) => DisposeFn;
export interface SelectItemParentContextValue {
    adaptScope: string;
    scopeName: string;
    id?: string;
    name?: string;
    form?: string;
    mode: SelectMode;
    selectedValues: string[];
    registry: SelectItemRegistry;
    listRef?: MutableRefObject<Array<HTMLElement | null>>;
    requestOpenChange: (open: boolean, details: SelectOpenChangeDetails) => void;
    selectValue: (value: string, details: SelectValueChangeDetails) => void;
    changeNativeValue: (value: SelectSelection, event: unknown) => void;
    activeIndexSubscribe: EmitterSubscriber<number>;
    activeIndexRef?: MutableRefObject<number | null>;
    allowSelectRef?: MutableRefObject<boolean>;
    allowMouseUpRef?: MutableRefObject<boolean>;
    selectTimeoutRef?: MutableRefObject<any>;
    dataRef?: MutableRefObject<ContextData>;
    interactions?: {
        getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => any;
        getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
        getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any;
    };
    shouldRenderWebNative?: boolean;
    size?: SizeTokens | true;
    /** fast setter: updates ref + emits to subscribers (no re-render) - use for keyboard navigation */
    setActiveIndexFast?: (index: number | null, details?: SelectActiveChangeDetails) => void;
    moveActive: (direction: 1 | -1, event?: unknown) => void;
    search: (text: string, event?: unknown) => void;
}
export interface SelectContextValue {
    dir?: SelectDirection;
    scopeName: string;
    adaptScope: string;
    value: any;
    mode: SelectMode;
    selectedValues: string[];
    activeItem?: string;
    selectionAnchor?: string;
    selectedIndex: number;
    /** current active index state - use for rendering, may lag behind ref */
    activeIndex: number | null;
    /** ref to current active index - always up to date, use for reads */
    activeIndexRef: MutableRefObject<number | null>;
    /** slow setter: updates ref + emits + triggers re-render */
    setActiveIndex: (index: number | null, details?: SelectActiveChangeDetails) => void;
    open: boolean;
    valueNode: Element | null;
    onValueNodeChange(node: HTMLElement): void;
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
    /** When true, defers mounting items until opened */
    lazyMount?: boolean;
}
export type SelectViewportExtraProps = SelectScopedProps<{
    size?: SizeTokens | true;
    disableScroll?: boolean;
}>;
export type SelectViewportProps = ViewProps & SelectViewportExtraProps;
export type SelectContentProps = SelectScopedProps<{
    children?: React.ReactNode;
} & Pick<DismissableProps, 'onEscapeKeyDown' | 'onPointerDownOutside' | 'onFocusOutside' | 'onInteractOutside'>>;
export type SelectScrollButtonImplProps = ViewProps & SelectScopedProps<{
    dir: 'up' | 'down';
    componentName: string;
}>;
export interface SelectScrollButtonProps extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {
}
export {};
//# sourceMappingURL=types.d.ts.map