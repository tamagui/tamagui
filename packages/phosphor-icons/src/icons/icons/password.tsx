import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PasswordBold } from '../bold/password-bold'
import { PasswordDuotone } from '../duotone/password-duotone'
import { PasswordFill } from '../fill/password-fill'
import { PasswordLight } from '../light/password-light'
import { PasswordRegular } from '../regular/password-regular'
import { PasswordThin } from '../thin/password-thin'

const weightMap = {
  regular: PasswordRegular,
  bold: PasswordBold,
  duotone: PasswordDuotone,
  fill: PasswordFill,
  light: PasswordLight,
  thin: PasswordThin,
} as const

export const Password = (props: IconProps) => {
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
