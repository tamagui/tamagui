import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandshakeBold } from '../bold/handshake-bold'
import { HandshakeDuotone } from '../duotone/handshake-duotone'
import { HandshakeFill } from '../fill/handshake-fill'
import { HandshakeLight } from '../light/handshake-light'
import { HandshakeRegular } from '../regular/handshake-regular'
import { HandshakeThin } from '../thin/handshake-thin'

const weightMap = {
  regular: HandshakeRegular,
  bold: HandshakeBold,
  duotone: HandshakeDuotone,
  fill: HandshakeFill,
  light: HandshakeLight,
  thin: HandshakeThin,
} as const

export const Handshake = (props: IconProps) => {
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
