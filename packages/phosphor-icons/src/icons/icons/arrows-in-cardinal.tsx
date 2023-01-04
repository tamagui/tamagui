import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsInCardinalBold } from '../bold/arrows-in-cardinal-bold'
import { ArrowsInCardinalDuotone } from '../duotone/arrows-in-cardinal-duotone'
import { ArrowsInCardinalFill } from '../fill/arrows-in-cardinal-fill'
import { ArrowsInCardinalLight } from '../light/arrows-in-cardinal-light'
import { ArrowsInCardinalRegular } from '../regular/arrows-in-cardinal-regular'
import { ArrowsInCardinalThin } from '../thin/arrows-in-cardinal-thin'

const weightMap = {
  regular: ArrowsInCardinalRegular,
  bold: ArrowsInCardinalBold,
  duotone: ArrowsInCardinalDuotone,
  fill: ArrowsInCardinalFill,
  light: ArrowsInCardinalLight,
  thin: ArrowsInCardinalThin,
} as const

export const ArrowsInCardinal = (props: IconProps) => {
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
