import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CropBold } from '../bold/crop-bold'
import { CropDuotone } from '../duotone/crop-duotone'
import { CropFill } from '../fill/crop-fill'
import { CropLight } from '../light/crop-light'
import { CropRegular } from '../regular/crop-regular'
import { CropThin } from '../thin/crop-thin'

const weightMap = {
  regular: CropRegular,
  bold: CropBold,
  duotone: CropDuotone,
  fill: CropFill,
  light: CropLight,
  thin: CropThin,
} as const

export const Crop = (props: IconProps) => {
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
