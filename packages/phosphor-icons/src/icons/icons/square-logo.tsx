import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SquareLogoBold } from '../bold/square-logo-bold'
import { SquareLogoDuotone } from '../duotone/square-logo-duotone'
import { SquareLogoFill } from '../fill/square-logo-fill'
import { SquareLogoLight } from '../light/square-logo-light'
import { SquareLogoRegular } from '../regular/square-logo-regular'
import { SquareLogoThin } from '../thin/square-logo-thin'

const weightMap = {
  regular: SquareLogoRegular,
  bold: SquareLogoBold,
  duotone: SquareLogoDuotone,
  fill: SquareLogoFill,
  light: SquareLogoLight,
  thin: SquareLogoThin,
} as const

export const SquareLogo = (props: IconProps) => {
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
