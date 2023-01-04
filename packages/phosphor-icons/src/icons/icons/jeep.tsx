import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { JeepBold } from '../bold/jeep-bold'
import { JeepDuotone } from '../duotone/jeep-duotone'
import { JeepFill } from '../fill/jeep-fill'
import { JeepLight } from '../light/jeep-light'
import { JeepRegular } from '../regular/jeep-regular'
import { JeepThin } from '../thin/jeep-thin'

const weightMap = {
  regular: JeepRegular,
  bold: JeepBold,
  duotone: JeepDuotone,
  fill: JeepFill,
  light: JeepLight,
  thin: JeepThin,
} as const

export const Jeep = (props: IconProps) => {
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
