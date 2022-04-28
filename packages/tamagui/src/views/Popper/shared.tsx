export const defaultArrowHeight = 11
export const defaultArrowWidth = 11

export const getDiagonalLength = (height: number, width: number) => {
  return Math.pow(height * height + width * width, 0.5)
}
