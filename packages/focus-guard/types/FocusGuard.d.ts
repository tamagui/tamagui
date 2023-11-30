declare function FocusGuards(props: any): any;
/**
 * Injects a pair of focus guards at the edges of the whole DOM tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */
declare function useFocusGuards(): void;
declare const Root: typeof FocusGuards;
export { FocusGuards, Root, useFocusGuards, };
//# sourceMappingURL=FocusGuard.d.ts.map