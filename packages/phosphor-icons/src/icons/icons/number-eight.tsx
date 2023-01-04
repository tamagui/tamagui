import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberEightBold } from '../bold/number-eight-bold'
import { NumberEightDuotone } from '../duotone/number-eight-duotone'
import { NumberEightFill } from '../fill/number-eight-fill'
import { NumberEightLight } from '../light/number-eight-light'
import { NumberEightRegular } from '../regular/number-eight-regular'
import { NumberEightThin } from '../thin/number-eight-thin'

const weightMap = {
  regular: NumberEightRegular,
  bold: NumberEightBold,
  duotone: NumberEightDuotone,
  fill: NumberEightFill,
  light: NumberEightLight,
  thin: NumberEightThin,
} as const

export const NumberEight = (props: IconProps) => {
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
