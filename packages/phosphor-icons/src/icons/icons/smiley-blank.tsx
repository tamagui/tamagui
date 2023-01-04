import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyBlankBold } from '../bold/smiley-blank-bold'
import { SmileyBlankDuotone } from '../duotone/smiley-blank-duotone'
import { SmileyBlankFill } from '../fill/smiley-blank-fill'
import { SmileyBlankLight } from '../light/smiley-blank-light'
import { SmileyBlankRegular } from '../regular/smiley-blank-regular'
import { SmileyBlankThin } from '../thin/smiley-blank-thin'

const weightMap = {
  regular: SmileyBlankRegular,
  bold: SmileyBlankBold,
  duotone: SmileyBlankDuotone,
  fill: SmileyBlankFill,
  light: SmileyBlankLight,
  thin: SmileyBlankThin,
} as const

export const SmileyBlank = (props: IconProps) => {
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
