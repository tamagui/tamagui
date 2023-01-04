import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SignInBold } from '../bold/sign-in-bold'
import { SignInDuotone } from '../duotone/sign-in-duotone'
import { SignInFill } from '../fill/sign-in-fill'
import { SignInLight } from '../light/sign-in-light'
import { SignInRegular } from '../regular/sign-in-regular'
import { SignInThin } from '../thin/sign-in-thin'

const weightMap = {
  regular: SignInRegular,
  bold: SignInBold,
  duotone: SignInDuotone,
  fill: SignInFill,
  light: SignInLight,
  thin: SignInThin,
} as const

export const SignIn = (props: IconProps) => {
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
