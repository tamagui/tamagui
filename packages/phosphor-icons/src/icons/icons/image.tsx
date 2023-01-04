import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ImageBold } from '../bold/image-bold'
import { ImageDuotone } from '../duotone/image-duotone'
import { ImageFill } from '../fill/image-fill'
import { ImageLight } from '../light/image-light'
import { ImageRegular } from '../regular/image-regular'
import { ImageThin } from '../thin/image-thin'

const weightMap = {
  regular: ImageRegular,
  bold: ImageBold,
  duotone: ImageDuotone,
  fill: ImageFill,
  light: ImageLight,
  thin: ImageThin,
} as const

export const Image = (props: IconProps) => {
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
