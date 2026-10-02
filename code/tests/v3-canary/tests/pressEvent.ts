// a copy of code/core/core-test/pressEvent.ts: the release dry run copies this
// canary out of the monorepo, so it cannot import across packages
// responder fixtures include the native view measurement and touch coordinates
// consumed by react native's press handler, including move and cancel events.
export function pressEvent(pageX = 10, pageY = 10) {
  const target = {
    measure(callback: (...bounds: number[]) => void) {
      callback(0, 0, 100, 100, 0, 0)
    },
  }
  return {
    currentTarget: target,
    target,
    nativeEvent: {
      pageX,
      pageY,
      timestamp: Date.now(),
      touches: [{ pageX, pageY }],
      changedTouches: [{ pageX, pageY }],
    },
    persist() {},
    stopPropagation() {},
  }
}
