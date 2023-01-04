import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PoliceCarBold } from '../bold/police-car-bold'
import { PoliceCarDuotone } from '../duotone/police-car-duotone'
import { PoliceCarFill } from '../fill/police-car-fill'
import { PoliceCarLight } from '../light/police-car-light'
import { PoliceCarRegular } from '../regular/police-car-regular'
import { PoliceCarThin } from '../thin/police-car-thin'

const weightMap = {
  regular: PoliceCarRegular,
  bold: PoliceCarBold,
  duotone: PoliceCarDuotone,
  fill: PoliceCarFill,
  light: PoliceCarLight,
  thin: PoliceCarThin,
} as const

export const PoliceCar = (props: IconProps) => {
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
