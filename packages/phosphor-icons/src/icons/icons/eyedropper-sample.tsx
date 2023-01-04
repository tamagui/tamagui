import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyedropperSampleBold } from '../bold/eyedropper-sample-bold'
import { EyedropperSampleDuotone } from '../duotone/eyedropper-sample-duotone'
import { EyedropperSampleFill } from '../fill/eyedropper-sample-fill'
import { EyedropperSampleLight } from '../light/eyedropper-sample-light'
import { EyedropperSampleRegular } from '../regular/eyedropper-sample-regular'
import { EyedropperSampleThin } from '../thin/eyedropper-sample-thin'

const weightMap = {
  regular: EyedropperSampleRegular,
  bold: EyedropperSampleBold,
  duotone: EyedropperSampleDuotone,
  fill: EyedropperSampleFill,
  light: EyedropperSampleLight,
  thin: EyedropperSampleThin,
} as const

export const EyedropperSample = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
