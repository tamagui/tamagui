/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as ResponderSystem from './ResponderSystem';
export * from './utils';
export declare function useResponderEvents(hostRef: any, configIn?: ResponderSystem.ResponderConfig): void;
export declare function getResponderConfigIfDefined({ onMoveShouldSetResponder, onMoveShouldSetResponderCapture, onResponderEnd, onResponderGrant, onResponderMove, onResponderReject, onResponderRelease, onResponderStart, onResponderTerminate, onResponderTerminationRequest, onScrollShouldSetResponder, onScrollShouldSetResponderCapture, onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder, onStartShouldSetResponderCapture, }: ResponderSystem.ResponderConfig): ResponderSystem.ResponderConfig;
//# sourceMappingURL=useResponderEvents.d.ts.map