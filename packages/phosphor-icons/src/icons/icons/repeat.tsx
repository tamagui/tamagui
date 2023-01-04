import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RepeatBold } from '../bold/repeat-bold'
import { RepeatDuotone } from '../duotone/repeat-duotone'
import { RepeatFill } from '../fill/repeat-fill'
import { RepeatLight } from '../light/repeat-light'
import { RepeatRegular } from '../regular/repeat-regular'
import { RepeatThin } from '../thin/repeat-thin'

const weightMap = {
  regular: RepeatRegular,
  bold: RepeatBold,
  duotone: RepeatDuotone,
  fill: RepeatFill,
  light: RepeatLight,
  thin: RepeatThin,
} as const

export const Repeat = (props: IconProps) => {
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
