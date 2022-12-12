/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ResponderEvent } from './createResponderEvent';
type ResponderId = string;
export type ResponderConfig = {
    onResponderEnd?: ((e: ResponderEvent) => void) | null;
    onResponderGrant?: ((e: ResponderEvent) => void | boolean) | null;
    onResponderMove?: ((e: ResponderEvent) => void) | null;
    onResponderRelease?: ((e: ResponderEvent) => void) | null;
    onResponderReject?: ((e: ResponderEvent) => void) | null;
    onResponderStart?: ((e: ResponderEvent) => void) | null;
    onResponderTerminate?: ((e: ResponderEvent) => void) | null;
    onResponderTerminationRequest?: ((e: ResponderEvent) => boolean) | null;
    onStartShouldSetResponder?: ((e: ResponderEvent) => boolean) | null;
    onStartShouldSetResponderCapture?: ((e: ResponderEvent) => boolean) | null;
    onMoveShouldSetResponder?: ((e: ResponderEvent) => boolean) | null;
    onMoveShouldSetResponderCapture?: ((e: ResponderEvent) => boolean) | null;
    onScrollShouldSetResponder?: ((e: ResponderEvent) => boolean) | null;
    onScrollShouldSetResponderCapture?: ((e: ResponderEvent) => boolean) | null;
    onSelectionChangeShouldSetResponder?: ((e: ResponderEvent) => boolean) | null;
    onSelectionChangeShouldSetResponderCapture?: ((e: ResponderEvent) => boolean) | null;
};
export declare function attachListeners(): void;
/**
 * Register a node with the ResponderSystem.
 */
export declare function addNode(id: ResponderId, node: any, config: ResponderConfig): void;
/**
 * Unregister a node with the ResponderSystem.
 */
export declare function removeNode(id: ResponderId): void;
/**
 * Allow the current responder to be terminated from within components to support
 * more complex requirements, such as use with other React libraries for working
 * with scroll views, input views, etc.
 */
export declare function terminateResponder(): void;
/**
 * Allow unit tests to inspect the current responder in the system.
 * FOR TESTING ONLY.
 */
export declare function getResponderNode(): any;
export {};
//# sourceMappingURL=ResponderSystem.d.ts.map