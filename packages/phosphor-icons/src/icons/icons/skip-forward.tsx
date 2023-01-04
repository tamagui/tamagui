import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SkipForwardBold } from '../bold/skip-forward-bold'
import { SkipForwardDuotone } from '../duotone/skip-forward-duotone'
import { SkipForwardFill } from '../fill/skip-forward-fill'
import { SkipForwardLight } from '../light/skip-forward-light'
import { SkipForwardRegular } from '../regular/skip-forward-regular'
import { SkipForwardThin } from '../thin/skip-forward-thin'

const weightMap = {
  regular: SkipForwardRegular,
  bold: SkipForwardBold,
  duotone: SkipForwardDuotone,
  fill: SkipForwardFill,
  light: SkipForwardLight,
  thin: SkipForwardThin,
} as const

export const SkipForward = (props: IconProps) => {
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
