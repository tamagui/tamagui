import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeadlightsBold } from '../bold/headlights-bold'
import { HeadlightsDuotone } from '../duotone/headlights-duotone'
import { HeadlightsFill } from '../fill/headlights-fill'
import { HeadlightsLight } from '../light/headlights-light'
import { HeadlightsRegular } from '../regular/headlights-regular'
import { HeadlightsThin } from '../thin/headlights-thin'

const weightMap = {
  regular: HeadlightsRegular,
  bold: HeadlightsBold,
  duotone: HeadlightsDuotone,
  fill: HeadlightsFill,
  light: HeadlightsLight,
  thin: HeadlightsThin,
} as const

export const Headlights = (props: IconProps) => {
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
