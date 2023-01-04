import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CodepenLogoBold } from '../bold/codepen-logo-bold'
import { CodepenLogoDuotone } from '../duotone/codepen-logo-duotone'
import { CodepenLogoFill } from '../fill/codepen-logo-fill'
import { CodepenLogoLight } from '../light/codepen-logo-light'
import { CodepenLogoRegular } from '../regular/codepen-logo-regular'
import { CodepenLogoThin } from '../thin/codepen-logo-thin'

const weightMap = {
  regular: CodepenLogoRegular,
  bold: CodepenLogoBold,
  duotone: CodepenLogoDuotone,
  fill: CodepenLogoFill,
  light: CodepenLogoLight,
  thin: CodepenLogoThin,
} as const

export const CodepenLogo = (props: IconProps) => {
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
