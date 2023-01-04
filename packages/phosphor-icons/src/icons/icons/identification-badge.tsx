import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { IdentificationBadgeBold } from '../bold/identification-badge-bold'
import { IdentificationBadgeDuotone } from '../duotone/identification-badge-duotone'
import { IdentificationBadgeFill } from '../fill/identification-badge-fill'
import { IdentificationBadgeLight } from '../light/identification-badge-light'
import { IdentificationBadgeRegular } from '../regular/identification-badge-regular'
import { IdentificationBadgeThin } from '../thin/identification-badge-thin'

const weightMap = {
  regular: IdentificationBadgeRegular,
  bold: IdentificationBadgeBold,
  duotone: IdentificationBadgeDuotone,
  fill: IdentificationBadgeFill,
  light: IdentificationBadgeLight,
  thin: IdentificationBadgeThin,
} as const

export const IdentificationBadge = (props: IconProps) => {
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
