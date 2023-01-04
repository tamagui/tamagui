import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlameBold } from '../bold/flame-bold'
import { FlameDuotone } from '../duotone/flame-duotone'
import { FlameFill } from '../fill/flame-fill'
import { FlameLight } from '../light/flame-light'
import { FlameRegular } from '../regular/flame-regular'
import { FlameThin } from '../thin/flame-thin'

const weightMap = {
  regular: FlameRegular,
  bold: FlameBold,
  duotone: FlameDuotone,
  fill: FlameFill,
  light: FlameLight,
  thin: FlameThin,
} as const

export const Flame = (props: IconProps) => {
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
