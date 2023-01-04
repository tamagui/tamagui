import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandFistBold } from '../bold/hand-fist-bold'
import { HandFistDuotone } from '../duotone/hand-fist-duotone'
import { HandFistFill } from '../fill/hand-fist-fill'
import { HandFistLight } from '../light/hand-fist-light'
import { HandFistRegular } from '../regular/hand-fist-regular'
import { HandFistThin } from '../thin/hand-fist-thin'

const weightMap = {
  regular: HandFistRegular,
  bold: HandFistBold,
  duotone: HandFistDuotone,
  fill: HandFistFill,
  light: HandFistLight,
  thin: HandFistThin,
} as const

export const HandFist = (props: IconProps) => {
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
