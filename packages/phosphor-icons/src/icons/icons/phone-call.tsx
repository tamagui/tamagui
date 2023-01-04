import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneCallBold } from '../bold/phone-call-bold'
import { PhoneCallDuotone } from '../duotone/phone-call-duotone'
import { PhoneCallFill } from '../fill/phone-call-fill'
import { PhoneCallLight } from '../light/phone-call-light'
import { PhoneCallRegular } from '../regular/phone-call-regular'
import { PhoneCallThin } from '../thin/phone-call-thin'

const weightMap = {
  regular: PhoneCallRegular,
  bold: PhoneCallBold,
  duotone: PhoneCallDuotone,
  fill: PhoneCallFill,
  light: PhoneCallLight,
  thin: PhoneCallThin,
} as const

export const PhoneCall = (props: IconProps) => {
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
