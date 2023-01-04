import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SimCardBold } from '../bold/sim-card-bold'
import { SimCardDuotone } from '../duotone/sim-card-duotone'
import { SimCardFill } from '../fill/sim-card-fill'
import { SimCardLight } from '../light/sim-card-light'
import { SimCardRegular } from '../regular/sim-card-regular'
import { SimCardThin } from '../thin/sim-card-thin'

const weightMap = {
  regular: SimCardRegular,
  bold: SimCardBold,
  duotone: SimCardDuotone,
  fill: SimCardFill,
  light: SimCardLight,
  thin: SimCardThin,
} as const

export const SimCard = (props: IconProps) => {
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
