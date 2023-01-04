import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandBold } from '../bold/hand-bold'
import { HandDuotone } from '../duotone/hand-duotone'
import { HandFill } from '../fill/hand-fill'
import { HandLight } from '../light/hand-light'
import { HandRegular } from '../regular/hand-regular'
import { HandThin } from '../thin/hand-thin'

const weightMap = {
  regular: HandRegular,
  bold: HandBold,
  duotone: HandDuotone,
  fill: HandFill,
  light: HandLight,
  thin: HandThin,
} as const

export const Hand = (props: IconProps) => {
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
