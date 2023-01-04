import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneDisconnectBold } from '../bold/phone-disconnect-bold'
import { PhoneDisconnectDuotone } from '../duotone/phone-disconnect-duotone'
import { PhoneDisconnectFill } from '../fill/phone-disconnect-fill'
import { PhoneDisconnectLight } from '../light/phone-disconnect-light'
import { PhoneDisconnectRegular } from '../regular/phone-disconnect-regular'
import { PhoneDisconnectThin } from '../thin/phone-disconnect-thin'

const weightMap = {
  regular: PhoneDisconnectRegular,
  bold: PhoneDisconnectBold,
  duotone: PhoneDisconnectDuotone,
  fill: PhoneDisconnectFill,
  light: PhoneDisconnectLight,
  thin: PhoneDisconnectThin,
} as const

export const PhoneDisconnect = (props: IconProps) => {
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
