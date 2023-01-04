import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiamondsFourBold } from '../bold/diamonds-four-bold'
import { DiamondsFourDuotone } from '../duotone/diamonds-four-duotone'
import { DiamondsFourFill } from '../fill/diamonds-four-fill'
import { DiamondsFourLight } from '../light/diamonds-four-light'
import { DiamondsFourRegular } from '../regular/diamonds-four-regular'
import { DiamondsFourThin } from '../thin/diamonds-four-thin'

const weightMap = {
  regular: DiamondsFourRegular,
  bold: DiamondsFourBold,
  duotone: DiamondsFourDuotone,
  fill: DiamondsFourFill,
  light: DiamondsFourLight,
  thin: DiamondsFourThin,
} as const

export const DiamondsFour = (props: IconProps) => {
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
