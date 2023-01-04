import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleNotchBold } from '../bold/circle-notch-bold'
import { CircleNotchDuotone } from '../duotone/circle-notch-duotone'
import { CircleNotchFill } from '../fill/circle-notch-fill'
import { CircleNotchLight } from '../light/circle-notch-light'
import { CircleNotchRegular } from '../regular/circle-notch-regular'
import { CircleNotchThin } from '../thin/circle-notch-thin'

const weightMap = {
  regular: CircleNotchRegular,
  bold: CircleNotchBold,
  duotone: CircleNotchDuotone,
  fill: CircleNotchFill,
  light: CircleNotchLight,
  thin: CircleNotchThin,
} as const

export const CircleNotch = (props: IconProps) => {
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
