import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MediumLogoBold } from '../bold/medium-logo-bold'
import { MediumLogoDuotone } from '../duotone/medium-logo-duotone'
import { MediumLogoFill } from '../fill/medium-logo-fill'
import { MediumLogoLight } from '../light/medium-logo-light'
import { MediumLogoRegular } from '../regular/medium-logo-regular'
import { MediumLogoThin } from '../thin/medium-logo-thin'

const weightMap = {
  regular: MediumLogoRegular,
  bold: MediumLogoBold,
  duotone: MediumLogoDuotone,
  fill: MediumLogoFill,
  light: MediumLogoLight,
  thin: MediumLogoThin,
} as const

export const MediumLogo = (props: IconProps) => {
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
