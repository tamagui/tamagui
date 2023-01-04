import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PercentBold } from '../bold/percent-bold'
import { PercentDuotone } from '../duotone/percent-duotone'
import { PercentFill } from '../fill/percent-fill'
import { PercentLight } from '../light/percent-light'
import { PercentRegular } from '../regular/percent-regular'
import { PercentThin } from '../thin/percent-thin'

const weightMap = {
  regular: PercentRegular,
  bold: PercentBold,
  duotone: PercentDuotone,
  fill: PercentFill,
  light: PercentLight,
  thin: PercentThin,
} as const

export const Percent = (props: IconProps) => {
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
