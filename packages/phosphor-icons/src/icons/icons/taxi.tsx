import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TaxiBold } from '../bold/taxi-bold'
import { TaxiDuotone } from '../duotone/taxi-duotone'
import { TaxiFill } from '../fill/taxi-fill'
import { TaxiLight } from '../light/taxi-light'
import { TaxiRegular } from '../regular/taxi-regular'
import { TaxiThin } from '../thin/taxi-thin'

const weightMap = {
  regular: TaxiRegular,
  bold: TaxiBold,
  duotone: TaxiDuotone,
  fill: TaxiFill,
  light: TaxiLight,
  thin: TaxiThin,
} as const

export const Taxi = (props: IconProps) => {
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
