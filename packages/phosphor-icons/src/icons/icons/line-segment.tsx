import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LineSegmentBold } from '../bold/line-segment-bold'
import { LineSegmentDuotone } from '../duotone/line-segment-duotone'
import { LineSegmentFill } from '../fill/line-segment-fill'
import { LineSegmentLight } from '../light/line-segment-light'
import { LineSegmentRegular } from '../regular/line-segment-regular'
import { LineSegmentThin } from '../thin/line-segment-thin'

const weightMap = {
  regular: LineSegmentRegular,
  bold: LineSegmentBold,
  duotone: LineSegmentDuotone,
  fill: LineSegmentFill,
  light: LineSegmentLight,
  thin: LineSegmentThin,
} as const

export const LineSegment = (props: IconProps) => {
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
