import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StackOverflowLogoBold } from '../bold/stack-overflow-logo-bold'
import { StackOverflowLogoDuotone } from '../duotone/stack-overflow-logo-duotone'
import { StackOverflowLogoFill } from '../fill/stack-overflow-logo-fill'
import { StackOverflowLogoLight } from '../light/stack-overflow-logo-light'
import { StackOverflowLogoRegular } from '../regular/stack-overflow-logo-regular'
import { StackOverflowLogoThin } from '../thin/stack-overflow-logo-thin'

const weightMap = {
  regular: StackOverflowLogoRegular,
  bold: StackOverflowLogoBold,
  duotone: StackOverflowLogoDuotone,
  fill: StackOverflowLogoFill,
  light: StackOverflowLogoLight,
  thin: StackOverflowLogoThin,
} as const

export const StackOverflowLogo = (props: IconProps) => {
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
