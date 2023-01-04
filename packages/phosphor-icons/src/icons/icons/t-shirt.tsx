import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TShirtBold } from '../bold/t-shirt-bold'
import { TShirtDuotone } from '../duotone/t-shirt-duotone'
import { TShirtFill } from '../fill/t-shirt-fill'
import { TShirtLight } from '../light/t-shirt-light'
import { TShirtRegular } from '../regular/t-shirt-regular'
import { TShirtThin } from '../thin/t-shirt-thin'

const weightMap = {
  regular: TShirtRegular,
  bold: TShirtBold,
  duotone: TShirtDuotone,
  fill: TShirtFill,
  light: TShirtLight,
  thin: TShirtThin,
} as const

export const TShirt = (props: IconProps) => {
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
