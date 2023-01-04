import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SignOutBold } from '../bold/sign-out-bold'
import { SignOutDuotone } from '../duotone/sign-out-duotone'
import { SignOutFill } from '../fill/sign-out-fill'
import { SignOutLight } from '../light/sign-out-light'
import { SignOutRegular } from '../regular/sign-out-regular'
import { SignOutThin } from '../thin/sign-out-thin'

const weightMap = {
  regular: SignOutRegular,
  bold: SignOutBold,
  duotone: SignOutDuotone,
  fill: SignOutFill,
  light: SignOutLight,
  thin: SignOutThin,
} as const

export const SignOut = (props: IconProps) => {
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
