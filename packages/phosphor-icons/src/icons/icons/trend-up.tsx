import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrendUpBold } from '../bold/trend-up-bold'
import { TrendUpDuotone } from '../duotone/trend-up-duotone'
import { TrendUpFill } from '../fill/trend-up-fill'
import { TrendUpLight } from '../light/trend-up-light'
import { TrendUpRegular } from '../regular/trend-up-regular'
import { TrendUpThin } from '../thin/trend-up-thin'

const weightMap = {
  regular: TrendUpRegular,
  bold: TrendUpBold,
  duotone: TrendUpDuotone,
  fill: TrendUpFill,
  light: TrendUpLight,
  thin: TrendUpThin,
} as const

export const TrendUp = (props: IconProps) => {
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
