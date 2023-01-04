import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GhostBold } from '../bold/ghost-bold'
import { GhostDuotone } from '../duotone/ghost-duotone'
import { GhostFill } from '../fill/ghost-fill'
import { GhostLight } from '../light/ghost-light'
import { GhostRegular } from '../regular/ghost-regular'
import { GhostThin } from '../thin/ghost-thin'

const weightMap = {
  regular: GhostRegular,
  bold: GhostBold,
  duotone: GhostDuotone,
  fill: GhostFill,
  light: GhostLight,
  thin: GhostThin,
} as const

export const Ghost = (props: IconProps) => {
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
