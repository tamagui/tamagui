import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StrategyBold } from '../bold/strategy-bold'
import { StrategyDuotone } from '../duotone/strategy-duotone'
import { StrategyFill } from '../fill/strategy-fill'
import { StrategyLight } from '../light/strategy-light'
import { StrategyRegular } from '../regular/strategy-regular'
import { StrategyThin } from '../thin/strategy-thin'

const weightMap = {
  regular: StrategyRegular,
  bold: StrategyBold,
  duotone: StrategyDuotone,
  fill: StrategyFill,
  light: StrategyLight,
  thin: StrategyThin,
} as const

export const Strategy = (props: IconProps) => {
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
