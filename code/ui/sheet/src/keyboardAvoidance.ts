export function getKeyboardOccludedHeight({
  frameSize,
  isKeyboardVisible,
  keyboardHeight,
  screenSize,
  sheetY,
}: {
  frameSize: number
  isKeyboardVisible: boolean
  keyboardHeight: number
  screenSize: number
  sheetY: number | undefined
}) {
  if (
    !isKeyboardVisible ||
    keyboardHeight <= 0 ||
    screenSize <= 0 ||
    frameSize <= 0 ||
    sheetY === undefined ||
    sheetY >= screenSize
  ) {
    return 0
  }

  const keyboardTop = screenSize - keyboardHeight
  const sheetBottom = sheetY + frameSize
  const occludedHeight = Math.ceil(sheetBottom - keyboardTop)

  return Math.min(frameSize, Math.max(0, occludedHeight))
}
