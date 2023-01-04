import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BeerBottleBold } from '../bold/beer-bottle-bold'
import { BeerBottleDuotone } from '../duotone/beer-bottle-duotone'
import { BeerBottleFill } from '../fill/beer-bottle-fill'
import { BeerBottleLight } from '../light/beer-bottle-light'
import { BeerBottleRegular } from '../regular/beer-bottle-regular'
import { BeerBottleThin } from '../thin/beer-bottle-thin'

const weightMap = {
  regular: BeerBottleRegular,
  bold: BeerBottleBold,
  duotone: BeerBottleDuotone,
  fill: BeerBottleFill,
  light: BeerBottleLight,
  thin: BeerBottleThin,
} as const

export const BeerBottle = (props: IconProps) => {
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
