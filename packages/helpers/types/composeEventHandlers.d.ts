type Events = any;
export type EventHandler<E extends Events> = (event: E) => void;
export declare function composeEventHandlers<E extends Events>(og?: EventHandler<E>, next?: EventHandler<E>, { checkDefaultPrevented }?: {
    checkDefaultPrevented?: boolean | undefined;
}): (event: E) => void;
export {};
//# sourceMappingURL=composeEventHandlers.d.ts.map