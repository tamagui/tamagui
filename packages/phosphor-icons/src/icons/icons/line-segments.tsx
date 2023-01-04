import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LineSegmentsBold } from '../bold/line-segments-bold'
import { LineSegmentsDuotone } from '../duotone/line-segments-duotone'
import { LineSegmentsFill } from '../fill/line-segments-fill'
import { LineSegmentsLight } from '../light/line-segments-light'
import { LineSegmentsRegular } from '../regular/line-segments-regular'
import { LineSegmentsThin } from '../thin/line-segments-thin'

const weightMap = {
  regular: LineSegmentsRegular,
  bold: LineSegmentsBold,
  duotone: LineSegmentsDuotone,
  fill: LineSegmentsFill,
  light: LineSegmentsLight,
  thin: LineSegmentsThin,
} as const

export const LineSegments = (props: IconProps) => {
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
