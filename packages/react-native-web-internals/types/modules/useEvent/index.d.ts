/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
type AddListener = (target: EventTarget, listener: null | ((arg0: any) => void)) => () => void;
/**
 * This can be used with any event type include custom events.
 *
 * const click = useEvent('click', options);
 * useEffect(() => {
 *   click.setListener(target, onClick);
 *   return () => click.clear();
 * }).
 */
export default function useEvent(event: string, options?: {
    capture?: boolean;
    passive?: boolean;
} | null): AddListener;
export {};
//# sourceMappingURL=index.d.ts.map