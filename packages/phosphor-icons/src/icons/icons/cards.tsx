import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CardsBold } from '../bold/cards-bold'
import { CardsDuotone } from '../duotone/cards-duotone'
import { CardsFill } from '../fill/cards-fill'
import { CardsLight } from '../light/cards-light'
import { CardsRegular } from '../regular/cards-regular'
import { CardsThin } from '../thin/cards-thin'

const weightMap = {
  regular: CardsRegular,
  bold: CardsBold,
  duotone: CardsDuotone,
  fill: CardsFill,
  light: CardsLight,
  thin: CardsThin,
} as const

export const Cards = (props: IconProps) => {
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
