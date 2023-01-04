import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NyTimesLogoBold } from '../bold/ny-times-logo-bold'
import { NyTimesLogoDuotone } from '../duotone/ny-times-logo-duotone'
import { NyTimesLogoFill } from '../fill/ny-times-logo-fill'
import { NyTimesLogoLight } from '../light/ny-times-logo-light'
import { NyTimesLogoRegular } from '../regular/ny-times-logo-regular'
import { NyTimesLogoThin } from '../thin/ny-times-logo-thin'

const weightMap = {
  regular: NyTimesLogoRegular,
  bold: NyTimesLogoBold,
  duotone: NyTimesLogoDuotone,
  fill: NyTimesLogoFill,
  light: NyTimesLogoLight,
  thin: NyTimesLogoThin,
} as const

export const NyTimesLogo = (props: IconProps) => {
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
