import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneXBold } from '../bold/phone-x-bold'
import { PhoneXDuotone } from '../duotone/phone-x-duotone'
import { PhoneXFill } from '../fill/phone-x-fill'
import { PhoneXLight } from '../light/phone-x-light'
import { PhoneXRegular } from '../regular/phone-x-regular'
import { PhoneXThin } from '../thin/phone-x-thin'

const weightMap = {
  regular: PhoneXRegular,
  bold: PhoneXBold,
  duotone: PhoneXDuotone,
  fill: PhoneXFill,
  light: PhoneXLight,
  thin: PhoneXThin,
} as const

export const PhoneX = (props: IconProps) => {
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
