import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeartBreakBold } from '../bold/heart-break-bold'
import { HeartBreakDuotone } from '../duotone/heart-break-duotone'
import { HeartBreakFill } from '../fill/heart-break-fill'
import { HeartBreakLight } from '../light/heart-break-light'
import { HeartBreakRegular } from '../regular/heart-break-regular'
import { HeartBreakThin } from '../thin/heart-break-thin'

const weightMap = {
  regular: HeartBreakRegular,
  bold: HeartBreakBold,
  duotone: HeartBreakDuotone,
  fill: HeartBreakFill,
  light: HeartBreakLight,
  thin: HeartBreakThin,
} as const

export const HeartBreak = (props: IconProps) => {
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
