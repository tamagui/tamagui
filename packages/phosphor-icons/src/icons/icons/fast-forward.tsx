import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FastForwardBold } from '../bold/fast-forward-bold'
import { FastForwardDuotone } from '../duotone/fast-forward-duotone'
import { FastForwardFill } from '../fill/fast-forward-fill'
import { FastForwardLight } from '../light/fast-forward-light'
import { FastForwardRegular } from '../regular/fast-forward-regular'
import { FastForwardThin } from '../thin/fast-forward-thin'

const weightMap = {
  regular: FastForwardRegular,
  bold: FastForwardBold,
  duotone: FastForwardDuotone,
  fill: FastForwardFill,
  light: FastForwardLight,
  thin: FastForwardThin,
} as const

export const FastForward = (props: IconProps) => {
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
