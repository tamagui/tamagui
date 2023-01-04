import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EnvelopeSimpleBold } from '../bold/envelope-simple-bold'
import { EnvelopeSimpleDuotone } from '../duotone/envelope-simple-duotone'
import { EnvelopeSimpleFill } from '../fill/envelope-simple-fill'
import { EnvelopeSimpleLight } from '../light/envelope-simple-light'
import { EnvelopeSimpleRegular } from '../regular/envelope-simple-regular'
import { EnvelopeSimpleThin } from '../thin/envelope-simple-thin'

const weightMap = {
  regular: EnvelopeSimpleRegular,
  bold: EnvelopeSimpleBold,
  duotone: EnvelopeSimpleDuotone,
  fill: EnvelopeSimpleFill,
  light: EnvelopeSimpleLight,
  thin: EnvelopeSimpleThin,
} as const

export const EnvelopeSimple = (props: IconProps) => {
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
