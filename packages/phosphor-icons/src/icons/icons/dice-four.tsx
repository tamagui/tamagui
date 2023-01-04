import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceFourBold } from '../bold/dice-four-bold'
import { DiceFourDuotone } from '../duotone/dice-four-duotone'
import { DiceFourFill } from '../fill/dice-four-fill'
import { DiceFourLight } from '../light/dice-four-light'
import { DiceFourRegular } from '../regular/dice-four-regular'
import { DiceFourThin } from '../thin/dice-four-thin'

const weightMap = {
  regular: DiceFourRegular,
  bold: DiceFourBold,
  duotone: DiceFourDuotone,
  fill: DiceFourFill,
  light: DiceFourLight,
  thin: DiceFourThin,
} as const

export const DiceFour = (props: IconProps) => {
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
