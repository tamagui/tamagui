import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeartStraightBold } from '../bold/heart-straight-bold'
import { HeartStraightDuotone } from '../duotone/heart-straight-duotone'
import { HeartStraightFill } from '../fill/heart-straight-fill'
import { HeartStraightLight } from '../light/heart-straight-light'
import { HeartStraightRegular } from '../regular/heart-straight-regular'
import { HeartStraightThin } from '../thin/heart-straight-thin'

const weightMap = {
  regular: HeartStraightRegular,
  bold: HeartStraightBold,
  duotone: HeartStraightDuotone,
  fill: HeartStraightFill,
  light: HeartStraightLight,
  thin: HeartStraightThin,
} as const

export const HeartStraight = (props: IconProps) => {
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
