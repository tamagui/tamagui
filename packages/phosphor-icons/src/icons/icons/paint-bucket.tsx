import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaintBucketBold } from '../bold/paint-bucket-bold'
import { PaintBucketDuotone } from '../duotone/paint-bucket-duotone'
import { PaintBucketFill } from '../fill/paint-bucket-fill'
import { PaintBucketLight } from '../light/paint-bucket-light'
import { PaintBucketRegular } from '../regular/paint-bucket-regular'
import { PaintBucketThin } from '../thin/paint-bucket-thin'

const weightMap = {
  regular: PaintBucketRegular,
  bold: PaintBucketBold,
  duotone: PaintBucketDuotone,
  fill: PaintBucketFill,
  light: PaintBucketLight,
  thin: PaintBucketThin,
} as const

export const PaintBucket = (props: IconProps) => {
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
