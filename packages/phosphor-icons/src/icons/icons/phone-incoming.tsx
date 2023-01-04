import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneIncomingBold } from '../bold/phone-incoming-bold'
import { PhoneIncomingDuotone } from '../duotone/phone-incoming-duotone'
import { PhoneIncomingFill } from '../fill/phone-incoming-fill'
import { PhoneIncomingLight } from '../light/phone-incoming-light'
import { PhoneIncomingRegular } from '../regular/phone-incoming-regular'
import { PhoneIncomingThin } from '../thin/phone-incoming-thin'

const weightMap = {
  regular: PhoneIncomingRegular,
  bold: PhoneIncomingBold,
  duotone: PhoneIncomingDuotone,
  fill: PhoneIncomingFill,
  light: PhoneIncomingLight,
  thin: PhoneIncomingThin,
} as const

export const PhoneIncoming = (props: IconProps) => {
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
