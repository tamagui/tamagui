import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyMehBold } from '../bold/smiley-meh-bold'
import { SmileyMehDuotone } from '../duotone/smiley-meh-duotone'
import { SmileyMehFill } from '../fill/smiley-meh-fill'
import { SmileyMehLight } from '../light/smiley-meh-light'
import { SmileyMehRegular } from '../regular/smiley-meh-regular'
import { SmileyMehThin } from '../thin/smiley-meh-thin'

const weightMap = {
  regular: SmileyMehRegular,
  bold: SmileyMehBold,
  duotone: SmileyMehDuotone,
  fill: SmileyMehFill,
  light: SmileyMehLight,
  thin: SmileyMehThin,
} as const

export const SmileyMeh = (props: IconProps) => {
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
