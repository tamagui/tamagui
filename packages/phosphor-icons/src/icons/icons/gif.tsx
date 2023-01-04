import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GifBold } from '../bold/gif-bold'
import { GifDuotone } from '../duotone/gif-duotone'
import { GifFill } from '../fill/gif-fill'
import { GifLight } from '../light/gif-light'
import { GifRegular } from '../regular/gif-regular'
import { GifThin } from '../thin/gif-thin'

const weightMap = {
  regular: GifRegular,
  bold: GifBold,
  duotone: GifDuotone,
  fill: GifFill,
  light: GifLight,
  thin: GifThin,
} as const

export const Gif = (props: IconProps) => {
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
