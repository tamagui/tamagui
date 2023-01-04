import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { IdentificationCardBold } from '../bold/identification-card-bold'
import { IdentificationCardDuotone } from '../duotone/identification-card-duotone'
import { IdentificationCardFill } from '../fill/identification-card-fill'
import { IdentificationCardLight } from '../light/identification-card-light'
import { IdentificationCardRegular } from '../regular/identification-card-regular'
import { IdentificationCardThin } from '../thin/identification-card-thin'

const weightMap = {
  regular: IdentificationCardRegular,
  bold: IdentificationCardBold,
  duotone: IdentificationCardDuotone,
  fill: IdentificationCardFill,
  light: IdentificationCardLight,
  thin: IdentificationCardThin,
} as const

export const IdentificationCard = (props: IconProps) => {
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
