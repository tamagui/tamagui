import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BehanceLogoBold } from '../bold/behance-logo-bold'
import { BehanceLogoDuotone } from '../duotone/behance-logo-duotone'
import { BehanceLogoFill } from '../fill/behance-logo-fill'
import { BehanceLogoLight } from '../light/behance-logo-light'
import { BehanceLogoRegular } from '../regular/behance-logo-regular'
import { BehanceLogoThin } from '../thin/behance-logo-thin'

const weightMap = {
  regular: BehanceLogoRegular,
  bold: BehanceLogoBold,
  duotone: BehanceLogoDuotone,
  fill: BehanceLogoFill,
  light: BehanceLogoLight,
  thin: BehanceLogoThin,
} as const

export const BehanceLogo = (props: IconProps) => {
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
