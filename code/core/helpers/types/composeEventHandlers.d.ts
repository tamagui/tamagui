type Events = Object;
export type EventHandler<E extends Events> = (event: E) => void;
export declare function composeEventHandlers<E extends Events>(og?: EventHandler<E> | null, next?: EventHandler<E> | null, { checkDefaultPrevented }?: {
    checkDefaultPrevented?: boolean | undefined;
}): EventHandler<E> | undefined;
export {};
//# sourceMappingURL=composeEventHandlers.d.ts.map