import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EnvelopeBold } from '../bold/envelope-bold'
import { EnvelopeDuotone } from '../duotone/envelope-duotone'
import { EnvelopeFill } from '../fill/envelope-fill'
import { EnvelopeLight } from '../light/envelope-light'
import { EnvelopeRegular } from '../regular/envelope-regular'
import { EnvelopeThin } from '../thin/envelope-thin'

const weightMap = {
  regular: EnvelopeRegular,
  bold: EnvelopeBold,
  duotone: EnvelopeDuotone,
  fill: EnvelopeFill,
  light: EnvelopeLight,
  thin: EnvelopeThin,
} as const

export const Envelope = (props: IconProps) => {
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
