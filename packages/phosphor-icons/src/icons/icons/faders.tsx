import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FadersBold } from '../bold/faders-bold'
import { FadersDuotone } from '../duotone/faders-duotone'
import { FadersFill } from '../fill/faders-fill'
import { FadersLight } from '../light/faders-light'
import { FadersRegular } from '../regular/faders-regular'
import { FadersThin } from '../thin/faders-thin'

const weightMap = {
  regular: FadersRegular,
  bold: FadersBold,
  duotone: FadersDuotone,
  fill: FadersFill,
  light: FadersLight,
  thin: FadersThin,
} as const

export const Faders = (props: IconProps) => {
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
