import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrademarkRegisteredBold } from '../bold/trademark-registered-bold'
import { TrademarkRegisteredDuotone } from '../duotone/trademark-registered-duotone'
import { TrademarkRegisteredFill } from '../fill/trademark-registered-fill'
import { TrademarkRegisteredLight } from '../light/trademark-registered-light'
import { TrademarkRegisteredRegular } from '../regular/trademark-registered-regular'
import { TrademarkRegisteredThin } from '../thin/trademark-registered-thin'

const weightMap = {
  regular: TrademarkRegisteredRegular,
  bold: TrademarkRegisteredBold,
  duotone: TrademarkRegisteredDuotone,
  fill: TrademarkRegisteredFill,
  light: TrademarkRegisteredLight,
  thin: TrademarkRegisteredThin,
} as const

export const TrademarkRegistered = (props: IconProps) => {
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
