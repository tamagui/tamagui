import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PhosphorLogoBold } from '../bold/phosphor-logo-bold'
import { PhosphorLogoDuotone } from '../duotone/phosphor-logo-duotone'
import { PhosphorLogoFill } from '../fill/phosphor-logo-fill'
import { PhosphorLogoLight } from '../light/phosphor-logo-light'
import { PhosphorLogoRegular } from '../regular/phosphor-logo-regular'
import { PhosphorLogoThin } from '../thin/phosphor-logo-thin'

const weightMap = {
  regular: PhosphorLogoRegular,
  bold: PhosphorLogoBold,
  duotone: PhosphorLogoDuotone,
  fill: PhosphorLogoFill,
  light: PhosphorLogoLight,
  thin: PhosphorLogoThin,
} as const

export const PhosphorLogo = (props: IconProps) => {
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
