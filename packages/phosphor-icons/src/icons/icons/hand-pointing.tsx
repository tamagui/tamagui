import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandPointingBold } from '../bold/hand-pointing-bold'
import { HandPointingDuotone } from '../duotone/hand-pointing-duotone'
import { HandPointingFill } from '../fill/hand-pointing-fill'
import { HandPointingLight } from '../light/hand-pointing-light'
import { HandPointingRegular } from '../regular/hand-pointing-regular'
import { HandPointingThin } from '../thin/hand-pointing-thin'

const weightMap = {
  regular: HandPointingRegular,
  bold: HandPointingBold,
  duotone: HandPointingDuotone,
  fill: HandPointingFill,
  light: HandPointingLight,
  thin: HandPointingThin,
} as const

export const HandPointing = (props: IconProps) => {
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
