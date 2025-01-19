/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
export declare const InteractionManager: {
    Events: {
        interactionStart: string;
        interactionComplete: string;
    };
    /**
     * Schedule a function to run after all interactions have completed.
     */
    runAfterInteractions(task: any): {
        then: Function;
        done: Function;
        cancel: Function;
    };
    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle(): number;
    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle(handle: number): void;
    addListener: () => void;
};
export default InteractionManager;
//# sourceMappingURL=InteractionManager.d.ts.map