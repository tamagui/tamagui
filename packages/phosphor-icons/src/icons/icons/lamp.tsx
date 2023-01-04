import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LampBold } from '../bold/lamp-bold'
import { LampDuotone } from '../duotone/lamp-duotone'
import { LampFill } from '../fill/lamp-fill'
import { LampLight } from '../light/lamp-light'
import { LampRegular } from '../regular/lamp-regular'
import { LampThin } from '../thin/lamp-thin'

const weightMap = {
  regular: LampRegular,
  bold: LampBold,
  duotone: LampDuotone,
  fill: LampFill,
  light: LampLight,
  thin: LampThin,
} as const

export const Lamp = (props: IconProps) => {
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
