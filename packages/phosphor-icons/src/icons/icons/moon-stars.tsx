import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MoonStarsBold } from '../bold/moon-stars-bold'
import { MoonStarsDuotone } from '../duotone/moon-stars-duotone'
import { MoonStarsFill } from '../fill/moon-stars-fill'
import { MoonStarsLight } from '../light/moon-stars-light'
import { MoonStarsRegular } from '../regular/moon-stars-regular'
import { MoonStarsThin } from '../thin/moon-stars-thin'

const weightMap = {
  regular: MoonStarsRegular,
  bold: MoonStarsBold,
  duotone: MoonStarsDuotone,
  fill: MoonStarsFill,
  light: MoonStarsLight,
  thin: MoonStarsThin,
} as const

export const MoonStars = (props: IconProps) => {
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
