import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EnvelopeSimpleOpenBold } from '../bold/envelope-simple-open-bold'
import { EnvelopeSimpleOpenDuotone } from '../duotone/envelope-simple-open-duotone'
import { EnvelopeSimpleOpenFill } from '../fill/envelope-simple-open-fill'
import { EnvelopeSimpleOpenLight } from '../light/envelope-simple-open-light'
import { EnvelopeSimpleOpenRegular } from '../regular/envelope-simple-open-regular'
import { EnvelopeSimpleOpenThin } from '../thin/envelope-simple-open-thin'

const weightMap = {
  regular: EnvelopeSimpleOpenRegular,
  bold: EnvelopeSimpleOpenBold,
  duotone: EnvelopeSimpleOpenDuotone,
  fill: EnvelopeSimpleOpenFill,
  light: EnvelopeSimpleOpenLight,
  thin: EnvelopeSimpleOpenThin,
} as const

export const EnvelopeSimpleOpen = (props: IconProps) => {
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
