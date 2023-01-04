import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeartBold } from '../bold/heart-bold'
import { HeartDuotone } from '../duotone/heart-duotone'
import { HeartFill } from '../fill/heart-fill'
import { HeartLight } from '../light/heart-light'
import { HeartRegular } from '../regular/heart-regular'
import { HeartThin } from '../thin/heart-thin'

const weightMap = {
  regular: HeartRegular,
  bold: HeartBold,
  duotone: HeartDuotone,
  fill: HeartFill,
  light: HeartLight,
  thin: HeartThin,
} as const

export const Heart = (props: IconProps) => {
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
