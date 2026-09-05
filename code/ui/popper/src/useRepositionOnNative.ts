/**
 * Web gets this for free: floating-ui's autoupdate already watches resize and
 * scroll, so there is nothing to do here. The native sibling is the real one.
 */
export const useRepositionOnNative = (
  _update: () => void,
  _passThrough: boolean | undefined
) => {}
