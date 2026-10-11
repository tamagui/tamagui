// a responder event for react native press tests: the view measurement and
// touch coordinates its press handler reads, with move and cancel support.
export declare function pressEvent(
  pageX?: number,
  pageY?: number
): {
  currentTarget: { measure(callback: (...bounds: number[]) => void): void }
  target: { measure(callback: (...bounds: number[]) => void): void }
  nativeEvent: {
    pageX: number
    pageY: number
    timestamp: number
    touches: { pageX: number; pageY: number }[]
    changedTouches: { pageX: number; pageY: number }[]
  }
  persist(): void
  stopPropagation(): void
}
