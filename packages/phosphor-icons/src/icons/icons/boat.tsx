import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BoatBold } from '../bold/boat-bold'
import { BoatDuotone } from '../duotone/boat-duotone'
import { BoatFill } from '../fill/boat-fill'
import { BoatLight } from '../light/boat-light'
import { BoatRegular } from '../regular/boat-regular'
import { BoatThin } from '../thin/boat-thin'

const weightMap = {
  regular: BoatRegular,
  bold: BoatBold,
  duotone: BoatDuotone,
  fill: BoatFill,
  light: BoatLight,
  thin: BoatThin,
} as const

export const Boat = (props: IconProps) => {
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
