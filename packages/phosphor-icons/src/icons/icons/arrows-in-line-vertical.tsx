import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsInLineVerticalBold } from '../bold/arrows-in-line-vertical-bold'
import { ArrowsInLineVerticalDuotone } from '../duotone/arrows-in-line-vertical-duotone'
import { ArrowsInLineVerticalFill } from '../fill/arrows-in-line-vertical-fill'
import { ArrowsInLineVerticalLight } from '../light/arrows-in-line-vertical-light'
import { ArrowsInLineVerticalRegular } from '../regular/arrows-in-line-vertical-regular'
import { ArrowsInLineVerticalThin } from '../thin/arrows-in-line-vertical-thin'

const weightMap = {
  regular: ArrowsInLineVerticalRegular,
  bold: ArrowsInLineVerticalBold,
  duotone: ArrowsInLineVerticalDuotone,
  fill: ArrowsInLineVerticalFill,
  light: ArrowsInLineVerticalLight,
  thin: ArrowsInLineVerticalThin,
} as const

export const ArrowsInLineVertical = (props: IconProps) => {
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
