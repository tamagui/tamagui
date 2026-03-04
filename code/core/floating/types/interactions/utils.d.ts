export declare function getDocument(node: Element | null | undefined): Document;
export declare function contains(parent?: Element | null, child?: Element | null): boolean;
export declare function getTarget(event: Event): EventTarget | null;
export declare function activeElement(doc: Document): Element | null;
export declare function isHTMLElement(value: unknown): value is HTMLElement;
export declare function isElement(value: unknown): value is Element;
export declare function isTypeableElement(element: unknown): boolean;
export declare function isTypeableCombobox(element: Element | null): boolean;
export declare function isSafari(): boolean;
export declare function isMac(): boolean;
export declare function matchesFocusVisible(element: Element | null): boolean;
export declare function isMouseLikePointerType(pointerType: string | undefined, strict?: boolean): boolean;
export declare function clearTimeoutIfSet(timeoutRef: {
    current: number;
}): void;
export declare function stopEvent(event: Event | React.SyntheticEvent): void;
export declare function isVirtualClick(event: MouseEvent | PointerEvent): boolean;
export declare function isVirtualPointerEvent(event: PointerEvent): boolean;
export declare function enqueueFocus(el: HTMLElement | null, options?: {
    preventScroll?: boolean;
    cancelPrevious?: boolean;
    sync?: boolean;
}): void;
type DisabledIndices = Array<number> | ((index: number) => boolean);
export declare function isListIndexDisabled(listRef: {
    current: Array<HTMLElement | null>;
}, index: number, disabledIndices?: DisabledIndices): boolean;
export declare function findNonDisabledListIndex(listRef: {
    current: Array<HTMLElement | null>;
}, { startingIndex, decrement, disabledIndices, amount, }?: {
    startingIndex?: number;
    decrement?: boolean;
    disabledIndices?: DisabledIndices;
    amount?: number;
}): number;
export declare function getMinListIndex(listRef: {
    current: Array<HTMLElement | null>;
}, disabledIndices: DisabledIndices | undefined): number;
export declare function getMaxListIndex(listRef: {
    current: Array<HTMLElement | null>;
}, disabledIndices: DisabledIndices | undefined): number;
export declare function isIndexOutOfListBounds(listRef: {
    current: Array<HTMLElement | null>;
}, index: number): boolean;
export {};
//# sourceMappingURL=utils.d.ts.map