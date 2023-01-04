import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CheckBold } from '../bold/check-bold'
import { CheckDuotone } from '../duotone/check-duotone'
import { CheckFill } from '../fill/check-fill'
import { CheckLight } from '../light/check-light'
import { CheckRegular } from '../regular/check-regular'
import { CheckThin } from '../thin/check-thin'

const weightMap = {
  regular: CheckRegular,
  bold: CheckBold,
  duotone: CheckDuotone,
  fill: CheckFill,
  light: CheckLight,
  thin: CheckThin,
} as const

export const Check = (props: IconProps) => {
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
