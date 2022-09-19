/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { GenericStyleProp } from '../../types.js';
/**
 * Adds non-standard methods to the hode element. This is temporarily until an
 * API like `ReactNative.measure(hostRef, callback)` is added to React Native.
 */
export default function usePlatformMethods({ pointerEvents, style, }: {
    style?: GenericStyleProp<unknown>;
    pointerEvents?: any;
}): (hostNode: any) => void;
//# sourceMappingURL=index.d.ts.map