import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhoneSlashBold } from '../bold/phone-slash-bold'
import { PhoneSlashDuotone } from '../duotone/phone-slash-duotone'
import { PhoneSlashFill } from '../fill/phone-slash-fill'
import { PhoneSlashLight } from '../light/phone-slash-light'
import { PhoneSlashRegular } from '../regular/phone-slash-regular'
import { PhoneSlashThin } from '../thin/phone-slash-thin'

const weightMap = {
  regular: PhoneSlashRegular,
  bold: PhoneSlashBold,
  duotone: PhoneSlashDuotone,
  fill: PhoneSlashFill,
  light: PhoneSlashLight,
  thin: PhoneSlashThin,
} as const

export const PhoneSlash = (props: IconProps) => {
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
