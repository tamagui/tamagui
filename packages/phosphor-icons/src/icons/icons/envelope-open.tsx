import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EnvelopeOpenBold } from '../bold/envelope-open-bold'
import { EnvelopeOpenDuotone } from '../duotone/envelope-open-duotone'
import { EnvelopeOpenFill } from '../fill/envelope-open-fill'
import { EnvelopeOpenLight } from '../light/envelope-open-light'
import { EnvelopeOpenRegular } from '../regular/envelope-open-regular'
import { EnvelopeOpenThin } from '../thin/envelope-open-thin'

const weightMap = {
  regular: EnvelopeOpenRegular,
  bold: EnvelopeOpenBold,
  duotone: EnvelopeOpenDuotone,
  fill: EnvelopeOpenFill,
  light: EnvelopeOpenLight,
  thin: EnvelopeOpenThin,
} as const

export const EnvelopeOpen = (props: IconProps) => {
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
