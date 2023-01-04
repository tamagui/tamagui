import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrendDownBold } from '../bold/trend-down-bold'
import { TrendDownDuotone } from '../duotone/trend-down-duotone'
import { TrendDownFill } from '../fill/trend-down-fill'
import { TrendDownLight } from '../light/trend-down-light'
import { TrendDownRegular } from '../regular/trend-down-regular'
import { TrendDownThin } from '../thin/trend-down-thin'

const weightMap = {
  regular: TrendDownRegular,
  bold: TrendDownBold,
  duotone: TrendDownDuotone,
  fill: TrendDownFill,
  light: TrendDownLight,
  thin: TrendDownThin,
} as const

export const TrendDown = (props: IconProps) => {
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
