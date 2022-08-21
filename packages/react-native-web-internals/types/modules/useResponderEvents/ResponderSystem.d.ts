import { ResponderEvent } from './createResponderEvent.js';
declare type ResponderId = number;
export declare type ResponderConfig = {
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
export declare function addNode(id: ResponderId, node: any, config: ResponderConfig): void;
export declare function removeNode(id: ResponderId): void;
export declare function terminateResponder(): void;
export declare function getResponderNode(): any;
export {};
//# sourceMappingURL=ResponderSystem.d.ts.map