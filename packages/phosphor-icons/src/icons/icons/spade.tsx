import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpadeBold } from '../bold/spade-bold'
import { SpadeDuotone } from '../duotone/spade-duotone'
import { SpadeFill } from '../fill/spade-fill'
import { SpadeLight } from '../light/spade-light'
import { SpadeRegular } from '../regular/spade-regular'
import { SpadeThin } from '../thin/spade-thin'

const weightMap = {
  regular: SpadeRegular,
  bold: SpadeBold,
  duotone: SpadeDuotone,
  fill: SpadeFill,
  light: SpadeLight,
  thin: SpadeThin,
} as const

export const Spade = (props: IconProps) => {
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
