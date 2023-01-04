import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyNervousBold } from '../bold/smiley-nervous-bold'
import { SmileyNervousDuotone } from '../duotone/smiley-nervous-duotone'
import { SmileyNervousFill } from '../fill/smiley-nervous-fill'
import { SmileyNervousLight } from '../light/smiley-nervous-light'
import { SmileyNervousRegular } from '../regular/smiley-nervous-regular'
import { SmileyNervousThin } from '../thin/smiley-nervous-thin'

const weightMap = {
  regular: SmileyNervousRegular,
  bold: SmileyNervousBold,
  duotone: SmileyNervousDuotone,
  fill: SmileyNervousFill,
  light: SmileyNervousLight,
  thin: SmileyNervousThin,
} as const

export const SmileyNervous = (props: IconProps) => {
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
