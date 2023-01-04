import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyeClosedBold } from '../bold/eye-closed-bold'
import { EyeClosedDuotone } from '../duotone/eye-closed-duotone'
import { EyeClosedFill } from '../fill/eye-closed-fill'
import { EyeClosedLight } from '../light/eye-closed-light'
import { EyeClosedRegular } from '../regular/eye-closed-regular'
import { EyeClosedThin } from '../thin/eye-closed-thin'

const weightMap = {
  regular: EyeClosedRegular,
  bold: EyeClosedBold,
  duotone: EyeClosedDuotone,
  fill: EyeClosedFill,
  light: EyeClosedLight,
  thin: EyeClosedThin,
} as const

export const EyeClosed = (props: IconProps) => {
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
