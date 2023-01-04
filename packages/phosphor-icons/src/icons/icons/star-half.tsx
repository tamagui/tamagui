import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StarHalfBold } from '../bold/star-half-bold'
import { StarHalfDuotone } from '../duotone/star-half-duotone'
import { StarHalfFill } from '../fill/star-half-fill'
import { StarHalfLight } from '../light/star-half-light'
import { StarHalfRegular } from '../regular/star-half-regular'
import { StarHalfThin } from '../thin/star-half-thin'

const weightMap = {
  regular: StarHalfRegular,
  bold: StarHalfBold,
  duotone: StarHalfDuotone,
  fill: StarHalfFill,
  light: StarHalfLight,
  thin: StarHalfThin,
} as const

export const StarHalf = (props: IconProps) => {
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
