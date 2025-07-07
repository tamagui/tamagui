/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
type EventSubscription = {
    remove: () => void;
};
type SimpleTask = {
    name: string;
    run: () => void;
};
type PromiseTask = {
    name: string;
    gen: () => Promise<void>;
};
export type Task = SimpleTask | PromiseTask | (() => void);
export declare const InteractionManager: {
    Events: {
        interactionStart: "interactionStart";
        interactionComplete: "interactionComplete";
    };
    /**
     * Schedule a function to run after all interactions have completed.
     */
    runAfterInteractions(task?: Task): {
        then: <TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) => Promise<TResult1 | TResult2>;
        done: <TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) => Promise<TResult1 | TResult2>;
        cancel: () => void;
    };
    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle(): number;
    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle(handle: number): void;
    addListener: (eventType: "interactionStart" | "interactionComplete", listener: () => void, context?: any) => EventSubscription;
    /**
     * Set deadline for task processing
     */
    setDeadline(deadline: number): void;
};
export {};
//# sourceMappingURL=InteractionManager.d.ts.map