import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneOutgoingBold } from '../bold/phone-outgoing-bold'
import { PhoneOutgoingDuotone } from '../duotone/phone-outgoing-duotone'
import { PhoneOutgoingFill } from '../fill/phone-outgoing-fill'
import { PhoneOutgoingLight } from '../light/phone-outgoing-light'
import { PhoneOutgoingRegular } from '../regular/phone-outgoing-regular'
import { PhoneOutgoingThin } from '../thin/phone-outgoing-thin'

const weightMap = {
  regular: PhoneOutgoingRegular,
  bold: PhoneOutgoingBold,
  duotone: PhoneOutgoingDuotone,
  fill: PhoneOutgoingFill,
  light: PhoneOutgoingLight,
  thin: PhoneOutgoingThin,
} as const

export const PhoneOutgoing = (props: IconProps) => {
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
