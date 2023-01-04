import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HouseBold } from '../bold/house-bold'
import { HouseDuotone } from '../duotone/house-duotone'
import { HouseFill } from '../fill/house-fill'
import { HouseLight } from '../light/house-light'
import { HouseRegular } from '../regular/house-regular'
import { HouseThin } from '../thin/house-thin'

const weightMap = {
  regular: HouseRegular,
  bold: HouseBold,
  duotone: HouseDuotone,
  fill: HouseFill,
  light: HouseLight,
  thin: HouseThin,
} as const

export const House = (props: IconProps) => {
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
