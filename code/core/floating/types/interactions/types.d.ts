import type { HTMLProps, RefObject } from 'react';
import type { FloatingEvents } from './createFloatingEvents';
import type { PopupTriggerMap } from './PopupTriggerMap';
export type { FloatingEvents };
export type ElementProps = {
    reference?: HTMLProps<Element>;
    floating?: HTMLProps<HTMLElement>;
    item?: HTMLProps<HTMLElement> | ((props: {
        active?: boolean;
        selected?: boolean;
    }) => HTMLProps<HTMLElement>);
};
export type OpenChangeReason = 'hover' | 'focus' | 'click' | 'dismiss' | 'list-navigation' | 'escape-key' | 'reference-press' | 'safe-polygon';
export interface FloatingInteractionContext {
    open: boolean;
    onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
    refs: {
        reference: RefObject<Element | null>;
        floating: RefObject<HTMLElement | null>;
        domReference: RefObject<Element | null>;
    };
    elements: {
        reference: Element | null;
        floating: HTMLElement | null;
        domReference: Element | null;
    };
    dataRef: RefObject<{
        openEvent?: Event;
        placement?: string;
        typing?: boolean;
    }>;
    events?: FloatingEvents;
    triggerElements?: PopupTriggerMap;
    handleCloseActiveRef?: RefObject<boolean>;
}
export type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export interface UseHoverProps {
    enabled?: boolean;
    delay?: Delay;
    restMs?: number;
    move?: boolean;
    handleClose?: HandleCloseFn | null;
    mouseOnly?: boolean;
}
export type HandleCloseFn = {
    (context: {
        x: number;
        y: number;
        placement: string;
        elements: {
            reference: Element;
            floating: HTMLElement;
            domReference: Element;
        };
        onClose: () => void;
        tree?: any;
        leave?: boolean;
    }): (event: MouseEvent) => void;
    __options?: SafePolygonOptions;
};
export interface SafePolygonOptions {
    requireIntent?: boolean;
    buffer?: number;
    blockPointerEvents?: boolean;
    /** render the safe polygon on screen for debugging */
    __debug?: boolean;
}
export interface UseFocusProps {
    enabled?: boolean;
    visibleOnly?: boolean;
}
export interface UseRoleProps {
    enabled?: boolean;
    role?: 'dialog' | 'tooltip' | 'alertdialog' | 'menu' | 'listbox' | 'grid' | 'tree' | 'select' | 'combobox' | 'label';
}
export interface UseClickProps {
    enabled?: boolean;
    event?: 'click' | 'mousedown';
    toggle?: boolean;
    ignoreMouse?: boolean;
    keyboardHandlers?: boolean;
    stickIfOpen?: boolean;
}
export interface UseListNavigationProps {
    listRef: RefObject<Array<HTMLElement | null>>;
    activeIndex: number | null;
    selectedIndex?: number | null;
    onNavigate?: (index: number | null) => void;
    enabled?: boolean;
    loop?: boolean;
    nested?: boolean;
    rtl?: boolean;
    virtual?: boolean;
    focusItemOnOpen?: boolean | 'auto';
    focusItemOnHover?: boolean;
    openOnArrowKeyDown?: boolean;
    scrollItemIntoView?: boolean | ScrollIntoViewOptions;
    allowEscape?: boolean;
    orientation?: 'vertical' | 'horizontal' | 'both';
    disabledIndices?: Array<number> | ((index: number) => boolean);
    cols?: number;
}
export interface UseTypeaheadProps {
    listRef: RefObject<Array<string | null>>;
    activeIndex: number | null;
    selectedIndex?: number | null;
    onMatch?: (index: number) => void;
    onTypingChange?: (isTyping: boolean) => void;
    enabled?: boolean;
    findMatch?: null | ((list: Array<string | null>, typedString: string) => string | null | undefined);
    resetMs?: number;
    ignoreKeys?: string[];
}
export interface UseInnerOffsetProps {
    enabled?: boolean;
    onChange: (offset: number | ((prev: number) => number)) => void;
    overflowRef: RefObject<any>;
    scrollRef?: RefObject<HTMLElement | null>;
}
//# sourceMappingURL=types.d.ts.map