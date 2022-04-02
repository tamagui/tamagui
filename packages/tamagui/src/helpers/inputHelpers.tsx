import { getSize } from './getSize'
import { sizableTextSizeVariant } from './sizableTextSizeVariant'

const inputSizeFrame = getSize(0.75, 0.75)

export const inputSizeVariant = (val = '4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = sizableTextSizeVariant(val, props)
  return {
    ...frame,
    ...font,
  }
}
