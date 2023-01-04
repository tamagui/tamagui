import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CheckSquareOffsetBold } from '../bold/check-square-offset-bold'
import { CheckSquareOffsetDuotone } from '../duotone/check-square-offset-duotone'
import { CheckSquareOffsetFill } from '../fill/check-square-offset-fill'
import { CheckSquareOffsetLight } from '../light/check-square-offset-light'
import { CheckSquareOffsetRegular } from '../regular/check-square-offset-regular'
import { CheckSquareOffsetThin } from '../thin/check-square-offset-thin'

const weightMap = {
  regular: CheckSquareOffsetRegular,
  bold: CheckSquareOffsetBold,
  duotone: CheckSquareOffsetDuotone,
  fill: CheckSquareOffsetFill,
  light: CheckSquareOffsetLight,
  thin: CheckSquareOffsetThin,
} as const

export const CheckSquareOffset = (props: IconProps) => {
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
