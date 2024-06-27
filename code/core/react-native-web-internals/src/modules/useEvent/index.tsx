/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import createEventHandle from '../createEventHandle/index'
import useLayoutEffect from '../useLayoutEffect/index'
import useStable from '../useStable/index'

type Callback = null | ((arg0: any) => void)
type AddListener = (
  target: EventTarget,
  listener: null | ((arg0: any) => void)
) => () => void

/**
 * This can be used with any event type include custom events.
 *
 * const click = useEvent('click', options);
 * useEffect(() => {
 *   click.setListener(target, onClick);
 *   return () => click.clear();
 * }).
 */
export default function useEvent(
  event: string,
  options?: {
    capture?: boolean
    passive?: boolean
  } | null
): AddListener {
  const targetListeners = useStable(() => new Map())

  const addListener = useStable(() => {
    const addEventListener = createEventHandle(event, options)
    return (target: EventTarget, callback: Callback) => {
      const removeTargetListener = targetListeners.get(target)
      if (removeTargetListener != null) {
        removeTargetListener()
      }
      if (callback == null) {
        targetListeners.delete(target)
      }
      const removeEventListener = addEventListener(target, callback)
      targetListeners.set(target, removeEventListener)
      return removeEventListener
    }
  })

  useLayoutEffect(() => {
    return () => {
      targetListeners.forEach((removeListener) => {
        removeListener()
      })
      targetListeners.clear()
    }
  }, [targetListeners])

  return addListener
}
