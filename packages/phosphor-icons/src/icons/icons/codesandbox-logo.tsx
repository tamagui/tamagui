import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CodesandboxLogoBold } from '../bold/codesandbox-logo-bold'
import { CodesandboxLogoDuotone } from '../duotone/codesandbox-logo-duotone'
import { CodesandboxLogoFill } from '../fill/codesandbox-logo-fill'
import { CodesandboxLogoLight } from '../light/codesandbox-logo-light'
import { CodesandboxLogoRegular } from '../regular/codesandbox-logo-regular'
import { CodesandboxLogoThin } from '../thin/codesandbox-logo-thin'

const weightMap = {
  regular: CodesandboxLogoRegular,
  bold: CodesandboxLogoBold,
  duotone: CodesandboxLogoDuotone,
  fill: CodesandboxLogoFill,
  light: CodesandboxLogoLight,
  thin: CodesandboxLogoThin,
} as const

export const CodesandboxLogo = (props: IconProps) => {
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
