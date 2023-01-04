import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DribbbleLogoBold } from '../bold/dribbble-logo-bold'
import { DribbbleLogoDuotone } from '../duotone/dribbble-logo-duotone'
import { DribbbleLogoFill } from '../fill/dribbble-logo-fill'
import { DribbbleLogoLight } from '../light/dribbble-logo-light'
import { DribbbleLogoRegular } from '../regular/dribbble-logo-regular'
import { DribbbleLogoThin } from '../thin/dribbble-logo-thin'

const weightMap = {
  regular: DribbbleLogoRegular,
  bold: DribbbleLogoBold,
  duotone: DribbbleLogoDuotone,
  fill: DribbbleLogoFill,
  light: DribbbleLogoLight,
  thin: DribbbleLogoThin,
} as const

export const DribbbleLogo = (props: IconProps) => {
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
