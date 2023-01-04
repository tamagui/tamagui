import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceSixBold } from '../bold/dice-six-bold'
import { DiceSixDuotone } from '../duotone/dice-six-duotone'
import { DiceSixFill } from '../fill/dice-six-fill'
import { DiceSixLight } from '../light/dice-six-light'
import { DiceSixRegular } from '../regular/dice-six-regular'
import { DiceSixThin } from '../thin/dice-six-thin'

const weightMap = {
  regular: DiceSixRegular,
  bold: DiceSixBold,
  duotone: DiceSixDuotone,
  fill: DiceSixFill,
  light: DiceSixLight,
  thin: DiceSixThin,
} as const

export const DiceSix = (props: IconProps) => {
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
