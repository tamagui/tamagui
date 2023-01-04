import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShowerBold } from '../bold/shower-bold'
import { ShowerDuotone } from '../duotone/shower-duotone'
import { ShowerFill } from '../fill/shower-fill'
import { ShowerLight } from '../light/shower-light'
import { ShowerRegular } from '../regular/shower-regular'
import { ShowerThin } from '../thin/shower-thin'

const weightMap = {
  regular: ShowerRegular,
  bold: ShowerBold,
  duotone: ShowerDuotone,
  fill: ShowerFill,
  light: ShowerLight,
  thin: ShowerThin,
} as const

export const Shower = (props: IconProps) => {
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
