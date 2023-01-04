import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyeBold } from '../bold/eye-bold'
import { EyeDuotone } from '../duotone/eye-duotone'
import { EyeFill } from '../fill/eye-fill'
import { EyeLight } from '../light/eye-light'
import { EyeRegular } from '../regular/eye-regular'
import { EyeThin } from '../thin/eye-thin'

const weightMap = {
  regular: EyeRegular,
  bold: EyeBold,
  duotone: EyeDuotone,
  fill: EyeFill,
  light: EyeLight,
  thin: EyeThin,
} as const

export const Eye = (props: IconProps) => {
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
