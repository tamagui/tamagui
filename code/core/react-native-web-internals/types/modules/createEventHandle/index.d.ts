/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
type Listener = (e: any) => void;
type EventHandle = (target: EventTarget, callback: Listener | null) => () => void;
export type EventOptions = {
    capture?: boolean;
    passive?: boolean;
};
/**
 *
 */
export default function createEventHandle(type: string, options?: EventOptions | null): EventHandle;
export {};
//# sourceMappingURL=index.d.ts.map