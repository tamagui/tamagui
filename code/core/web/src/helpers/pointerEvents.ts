/**
 * Web pointer events - no-op, pointer events work natively on web
 *
 * For drag scenarios, users should call e.target.setPointerCapture(e.pointerId)
 * in their onPointerDown handler to receive move events outside element bounds.
 */
export function usePointerEvents(_props: any, _viewProps: any) {
  // pointer events pass through directly on web
}
