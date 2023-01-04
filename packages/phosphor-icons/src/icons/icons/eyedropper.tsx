import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyedropperBold } from '../bold/eyedropper-bold'
import { EyedropperDuotone } from '../duotone/eyedropper-duotone'
import { EyedropperFill } from '../fill/eyedropper-fill'
import { EyedropperLight } from '../light/eyedropper-light'
import { EyedropperRegular } from '../regular/eyedropper-regular'
import { EyedropperThin } from '../thin/eyedropper-thin'

const weightMap = {
  regular: EyedropperRegular,
  bold: EyedropperBold,
  duotone: EyedropperDuotone,
  fill: EyedropperFill,
  light: EyedropperLight,
  thin: EyedropperThin,
} as const

export const Eyedropper = (props: IconProps) => {
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
