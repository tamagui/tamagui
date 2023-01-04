import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SkipForwardCircleBold } from '../bold/skip-forward-circle-bold'
import { SkipForwardCircleDuotone } from '../duotone/skip-forward-circle-duotone'
import { SkipForwardCircleFill } from '../fill/skip-forward-circle-fill'
import { SkipForwardCircleLight } from '../light/skip-forward-circle-light'
import { SkipForwardCircleRegular } from '../regular/skip-forward-circle-regular'
import { SkipForwardCircleThin } from '../thin/skip-forward-circle-thin'

const weightMap = {
  regular: SkipForwardCircleRegular,
  bold: SkipForwardCircleBold,
  duotone: SkipForwardCircleDuotone,
  fill: SkipForwardCircleFill,
  light: SkipForwardCircleLight,
  thin: SkipForwardCircleThin,
} as const

export const SkipForwardCircle = (props: IconProps) => {
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
