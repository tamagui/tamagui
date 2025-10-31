/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _requestIdleCallback = function (cb: Function, options?: any) {
  return setTimeout(() => {
    const start = Date.now()
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start))
      },
    })
  }, 1)
}

const _cancelIdleCallback = function (id: any) {
  clearTimeout(id)
}

const isSupported = typeof window !== 'undefined' && typeof window.requestIdleCallback !== 'undefined'

export const requestIdleCallback: (cb: any, options?: any) => any = isSupported
  ? window.requestIdleCallback
  : _requestIdleCallback
export const cancelIdleCallback: (id: any) => void = isSupported
  ? window.cancelIdleCallback
  : _cancelIdleCallback