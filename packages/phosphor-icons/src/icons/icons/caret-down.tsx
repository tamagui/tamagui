import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretDownBold } from '../bold/caret-down-bold'
import { CaretDownDuotone } from '../duotone/caret-down-duotone'
import { CaretDownFill } from '../fill/caret-down-fill'
import { CaretDownLight } from '../light/caret-down-light'
import { CaretDownRegular } from '../regular/caret-down-regular'
import { CaretDownThin } from '../thin/caret-down-thin'

const weightMap = {
  regular: CaretDownRegular,
  bold: CaretDownBold,
  duotone: CaretDownDuotone,
  fill: CaretDownFill,
  light: CaretDownLight,
  thin: CaretDownThin,
} as const

export const CaretDown = (props: IconProps) => {
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
