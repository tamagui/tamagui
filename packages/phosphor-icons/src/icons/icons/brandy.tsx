import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BrandyBold } from '../bold/brandy-bold'
import { BrandyDuotone } from '../duotone/brandy-duotone'
import { BrandyFill } from '../fill/brandy-fill'
import { BrandyLight } from '../light/brandy-light'
import { BrandyRegular } from '../regular/brandy-regular'
import { BrandyThin } from '../thin/brandy-thin'

const weightMap = {
  regular: BrandyRegular,
  bold: BrandyBold,
  duotone: BrandyDuotone,
  fill: BrandyFill,
  light: BrandyLight,
  thin: BrandyThin,
} as const

export const Brandy = (props: IconProps) => {
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
