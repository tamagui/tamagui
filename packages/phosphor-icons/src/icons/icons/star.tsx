import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StarBold } from '../bold/star-bold'
import { StarDuotone } from '../duotone/star-duotone'
import { StarFill } from '../fill/star-fill'
import { StarLight } from '../light/star-light'
import { StarRegular } from '../regular/star-regular'
import { StarThin } from '../thin/star-thin'

const weightMap = {
  regular: StarRegular,
  bold: StarBold,
  duotone: StarDuotone,
  fill: StarFill,
  light: StarLight,
  thin: StarThin,
} as const

export const Star = (props: IconProps) => {
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
