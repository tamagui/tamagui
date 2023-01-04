import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HighlighterCircleBold } from '../bold/highlighter-circle-bold'
import { HighlighterCircleDuotone } from '../duotone/highlighter-circle-duotone'
import { HighlighterCircleFill } from '../fill/highlighter-circle-fill'
import { HighlighterCircleLight } from '../light/highlighter-circle-light'
import { HighlighterCircleRegular } from '../regular/highlighter-circle-regular'
import { HighlighterCircleThin } from '../thin/highlighter-circle-thin'

const weightMap = {
  regular: HighlighterCircleRegular,
  bold: HighlighterCircleBold,
  duotone: HighlighterCircleDuotone,
  fill: HighlighterCircleFill,
  light: HighlighterCircleLight,
  thin: HighlighterCircleThin,
} as const

export const HighlighterCircle = (props: IconProps) => {
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
