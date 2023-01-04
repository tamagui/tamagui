import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeartStraightBreakBold } from '../bold/heart-straight-break-bold'
import { HeartStraightBreakDuotone } from '../duotone/heart-straight-break-duotone'
import { HeartStraightBreakFill } from '../fill/heart-straight-break-fill'
import { HeartStraightBreakLight } from '../light/heart-straight-break-light'
import { HeartStraightBreakRegular } from '../regular/heart-straight-break-regular'
import { HeartStraightBreakThin } from '../thin/heart-straight-break-thin'

const weightMap = {
  regular: HeartStraightBreakRegular,
  bold: HeartStraightBreakBold,
  duotone: HeartStraightBreakDuotone,
  fill: HeartStraightBreakFill,
  light: HeartStraightBreakLight,
  thin: HeartStraightBreakThin,
} as const

export const HeartStraightBreak = (props: IconProps) => {
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
