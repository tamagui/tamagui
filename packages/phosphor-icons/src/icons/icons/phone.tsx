import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneBold } from '../bold/phone-bold'
import { PhoneDuotone } from '../duotone/phone-duotone'
import { PhoneFill } from '../fill/phone-fill'
import { PhoneLight } from '../light/phone-light'
import { PhoneRegular } from '../regular/phone-regular'
import { PhoneThin } from '../thin/phone-thin'

const weightMap = {
  regular: PhoneRegular,
  bold: PhoneBold,
  duotone: PhoneDuotone,
  fill: PhoneFill,
  light: PhoneLight,
  thin: PhoneThin,
} as const

export const Phone = (props: IconProps) => {
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
