import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FastForwardCircleBold } from '../bold/fast-forward-circle-bold'
import { FastForwardCircleDuotone } from '../duotone/fast-forward-circle-duotone'
import { FastForwardCircleFill } from '../fill/fast-forward-circle-fill'
import { FastForwardCircleLight } from '../light/fast-forward-circle-light'
import { FastForwardCircleRegular } from '../regular/fast-forward-circle-regular'
import { FastForwardCircleThin } from '../thin/fast-forward-circle-thin'

const weightMap = {
  regular: FastForwardCircleRegular,
  bold: FastForwardCircleBold,
  duotone: FastForwardCircleDuotone,
  fill: FastForwardCircleFill,
  light: FastForwardCircleLight,
  thin: FastForwardCircleThin,
} as const

export const FastForwardCircle = (props: IconProps) => {
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
