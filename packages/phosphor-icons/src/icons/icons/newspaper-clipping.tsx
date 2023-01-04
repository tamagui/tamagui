import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NewspaperClippingBold } from '../bold/newspaper-clipping-bold'
import { NewspaperClippingDuotone } from '../duotone/newspaper-clipping-duotone'
import { NewspaperClippingFill } from '../fill/newspaper-clipping-fill'
import { NewspaperClippingLight } from '../light/newspaper-clipping-light'
import { NewspaperClippingRegular } from '../regular/newspaper-clipping-regular'
import { NewspaperClippingThin } from '../thin/newspaper-clipping-thin'

const weightMap = {
  regular: NewspaperClippingRegular,
  bold: NewspaperClippingBold,
  duotone: NewspaperClippingDuotone,
  fill: NewspaperClippingFill,
  light: NewspaperClippingLight,
  thin: NewspaperClippingThin,
} as const

export const NewspaperClipping = (props: IconProps) => {
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
