import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RepeatOnceBold } from '../bold/repeat-once-bold'
import { RepeatOnceDuotone } from '../duotone/repeat-once-duotone'
import { RepeatOnceFill } from '../fill/repeat-once-fill'
import { RepeatOnceLight } from '../light/repeat-once-light'
import { RepeatOnceRegular } from '../regular/repeat-once-regular'
import { RepeatOnceThin } from '../thin/repeat-once-thin'

const weightMap = {
  regular: RepeatOnceRegular,
  bold: RepeatOnceBold,
  duotone: RepeatOnceDuotone,
  fill: RepeatOnceFill,
  light: RepeatOnceLight,
  thin: RepeatOnceThin,
} as const

export const RepeatOnce = (props: IconProps) => {
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
