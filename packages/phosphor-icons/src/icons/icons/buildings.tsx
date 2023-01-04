import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BuildingsBold } from '../bold/buildings-bold'
import { BuildingsDuotone } from '../duotone/buildings-duotone'
import { BuildingsFill } from '../fill/buildings-fill'
import { BuildingsLight } from '../light/buildings-light'
import { BuildingsRegular } from '../regular/buildings-regular'
import { BuildingsThin } from '../thin/buildings-thin'

const weightMap = {
  regular: BuildingsRegular,
  bold: BuildingsBold,
  duotone: BuildingsDuotone,
  fill: BuildingsFill,
  light: BuildingsLight,
  thin: BuildingsThin,
} as const

export const Buildings = (props: IconProps) => {
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
