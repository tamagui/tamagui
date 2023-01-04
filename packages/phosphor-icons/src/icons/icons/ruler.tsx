import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RulerBold } from '../bold/ruler-bold'
import { RulerDuotone } from '../duotone/ruler-duotone'
import { RulerFill } from '../fill/ruler-fill'
import { RulerLight } from '../light/ruler-light'
import { RulerRegular } from '../regular/ruler-regular'
import { RulerThin } from '../thin/ruler-thin'

const weightMap = {
  regular: RulerRegular,
  bold: RulerBold,
  duotone: RulerDuotone,
  fill: RulerFill,
  light: RulerLight,
  thin: RulerThin,
} as const

export const Ruler = (props: IconProps) => {
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
