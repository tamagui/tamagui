import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BasketballBold } from '../bold/basketball-bold'
import { BasketballDuotone } from '../duotone/basketball-duotone'
import { BasketballFill } from '../fill/basketball-fill'
import { BasketballLight } from '../light/basketball-light'
import { BasketballRegular } from '../regular/basketball-regular'
import { BasketballThin } from '../thin/basketball-thin'

const weightMap = {
  regular: BasketballRegular,
  bold: BasketballBold,
  duotone: BasketballDuotone,
  fill: BasketballFill,
  light: BasketballLight,
  thin: BasketballThin,
} as const

export const Basketball = (props: IconProps) => {
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
