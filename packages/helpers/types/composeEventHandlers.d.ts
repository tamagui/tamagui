export declare type EventHandler<E extends Event> = (event: E) => void;
export declare function composeEventHandlers<E extends Event>(og?: EventHandler<E>, next?: EventHandler<E>, { checkDefaultPrevented }?: {
    checkDefaultPrevented?: boolean | undefined;
}): (event: E) => void;
//# sourceMappingURL=composeEventHandlers.d.ts.map