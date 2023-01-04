import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RainbowBold } from '../bold/rainbow-bold'
import { RainbowDuotone } from '../duotone/rainbow-duotone'
import { RainbowFill } from '../fill/rainbow-fill'
import { RainbowLight } from '../light/rainbow-light'
import { RainbowRegular } from '../regular/rainbow-regular'
import { RainbowThin } from '../thin/rainbow-thin'

const weightMap = {
  regular: RainbowRegular,
  bold: RainbowBold,
  duotone: RainbowDuotone,
  fill: RainbowFill,
  light: RainbowLight,
  thin: RainbowThin,
} as const

export const Rainbow = (props: IconProps) => {
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
