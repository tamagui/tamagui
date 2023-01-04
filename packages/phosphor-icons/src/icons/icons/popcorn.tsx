import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PopcornBold } from '../bold/popcorn-bold'
import { PopcornDuotone } from '../duotone/popcorn-duotone'
import { PopcornFill } from '../fill/popcorn-fill'
import { PopcornLight } from '../light/popcorn-light'
import { PopcornRegular } from '../regular/popcorn-regular'
import { PopcornThin } from '../thin/popcorn-thin'

const weightMap = {
  regular: PopcornRegular,
  bold: PopcornBold,
  duotone: PopcornDuotone,
  fill: PopcornFill,
  light: PopcornLight,
  thin: PopcornThin,
} as const

export const Popcorn = (props: IconProps) => {
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
