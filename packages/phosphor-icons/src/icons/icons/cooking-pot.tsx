import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CookingPotBold } from '../bold/cooking-pot-bold'
import { CookingPotDuotone } from '../duotone/cooking-pot-duotone'
import { CookingPotFill } from '../fill/cooking-pot-fill'
import { CookingPotLight } from '../light/cooking-pot-light'
import { CookingPotRegular } from '../regular/cooking-pot-regular'
import { CookingPotThin } from '../thin/cooking-pot-thin'

const weightMap = {
  regular: CookingPotRegular,
  bold: CookingPotBold,
  duotone: CookingPotDuotone,
  fill: CookingPotFill,
  light: CookingPotLight,
  thin: CookingPotThin,
} as const

export const CookingPot = (props: IconProps) => {
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
