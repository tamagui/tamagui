import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ImageSquareBold } from '../bold/image-square-bold'
import { ImageSquareDuotone } from '../duotone/image-square-duotone'
import { ImageSquareFill } from '../fill/image-square-fill'
import { ImageSquareLight } from '../light/image-square-light'
import { ImageSquareRegular } from '../regular/image-square-regular'
import { ImageSquareThin } from '../thin/image-square-thin'

const weightMap = {
  regular: ImageSquareRegular,
  bold: ImageSquareBold,
  duotone: ImageSquareDuotone,
  fill: ImageSquareFill,
  light: ImageSquareLight,
  thin: ImageSquareThin,
} as const

export const ImageSquare = (props: IconProps) => {
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
