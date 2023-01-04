import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsOutCardinalBold } from '../bold/arrows-out-cardinal-bold'
import { ArrowsOutCardinalDuotone } from '../duotone/arrows-out-cardinal-duotone'
import { ArrowsOutCardinalFill } from '../fill/arrows-out-cardinal-fill'
import { ArrowsOutCardinalLight } from '../light/arrows-out-cardinal-light'
import { ArrowsOutCardinalRegular } from '../regular/arrows-out-cardinal-regular'
import { ArrowsOutCardinalThin } from '../thin/arrows-out-cardinal-thin'

const weightMap = {
  regular: ArrowsOutCardinalRegular,
  bold: ArrowsOutCardinalBold,
  duotone: ArrowsOutCardinalDuotone,
  fill: ArrowsOutCardinalFill,
  light: ArrowsOutCardinalLight,
  thin: ArrowsOutCardinalThin,
} as const

export const ArrowsOutCardinal = (props: IconProps) => {
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
