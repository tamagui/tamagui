import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiamondBold } from '../bold/diamond-bold'
import { DiamondDuotone } from '../duotone/diamond-duotone'
import { DiamondFill } from '../fill/diamond-fill'
import { DiamondLight } from '../light/diamond-light'
import { DiamondRegular } from '../regular/diamond-regular'
import { DiamondThin } from '../thin/diamond-thin'

const weightMap = {
  regular: DiamondRegular,
  bold: DiamondBold,
  duotone: DiamondDuotone,
  fill: DiamondFill,
  light: DiamondLight,
  thin: DiamondThin,
} as const

export const Diamond = (props: IconProps) => {
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
