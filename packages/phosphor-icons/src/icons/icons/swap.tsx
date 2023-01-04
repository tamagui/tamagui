import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SwapBold } from '../bold/swap-bold'
import { SwapDuotone } from '../duotone/swap-duotone'
import { SwapFill } from '../fill/swap-fill'
import { SwapLight } from '../light/swap-light'
import { SwapRegular } from '../regular/swap-regular'
import { SwapThin } from '../thin/swap-thin'

const weightMap = {
  regular: SwapRegular,
  bold: SwapBold,
  duotone: SwapDuotone,
  fill: SwapFill,
  light: SwapLight,
  thin: SwapThin,
} as const

export const Swap = (props: IconProps) => {
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
