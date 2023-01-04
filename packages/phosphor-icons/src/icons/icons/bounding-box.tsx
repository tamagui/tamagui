import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BoundingBoxBold } from '../bold/bounding-box-bold'
import { BoundingBoxDuotone } from '../duotone/bounding-box-duotone'
import { BoundingBoxFill } from '../fill/bounding-box-fill'
import { BoundingBoxLight } from '../light/bounding-box-light'
import { BoundingBoxRegular } from '../regular/bounding-box-regular'
import { BoundingBoxThin } from '../thin/bounding-box-thin'

const weightMap = {
  regular: BoundingBoxRegular,
  bold: BoundingBoxBold,
  duotone: BoundingBoxDuotone,
  fill: BoundingBoxFill,
  light: BoundingBoxLight,
  thin: BoundingBoxThin,
} as const

export const BoundingBox = (props: IconProps) => {
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
