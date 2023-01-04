import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StarFourBold } from '../bold/star-four-bold'
import { StarFourDuotone } from '../duotone/star-four-duotone'
import { StarFourFill } from '../fill/star-four-fill'
import { StarFourLight } from '../light/star-four-light'
import { StarFourRegular } from '../regular/star-four-regular'
import { StarFourThin } from '../thin/star-four-thin'

const weightMap = {
  regular: StarFourRegular,
  bold: StarFourBold,
  duotone: StarFourDuotone,
  fill: StarFourFill,
  light: StarFourLight,
  thin: StarFourThin,
} as const

export const StarFour = (props: IconProps) => {
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
