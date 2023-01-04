import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyXEyesBold } from '../bold/smiley-x-eyes-bold'
import { SmileyXEyesDuotone } from '../duotone/smiley-x-eyes-duotone'
import { SmileyXEyesFill } from '../fill/smiley-x-eyes-fill'
import { SmileyXEyesLight } from '../light/smiley-x-eyes-light'
import { SmileyXEyesRegular } from '../regular/smiley-x-eyes-regular'
import { SmileyXEyesThin } from '../thin/smiley-x-eyes-thin'

const weightMap = {
  regular: SmileyXEyesRegular,
  bold: SmileyXEyesBold,
  duotone: SmileyXEyesDuotone,
  fill: SmileyXEyesFill,
  light: SmileyXEyesLight,
  thin: SmileyXEyesThin,
} as const

export const SmileyXEyes = (props: IconProps) => {
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
