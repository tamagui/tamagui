import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyWinkBold } from '../bold/smiley-wink-bold'
import { SmileyWinkDuotone } from '../duotone/smiley-wink-duotone'
import { SmileyWinkFill } from '../fill/smiley-wink-fill'
import { SmileyWinkLight } from '../light/smiley-wink-light'
import { SmileyWinkRegular } from '../regular/smiley-wink-regular'
import { SmileyWinkThin } from '../thin/smiley-wink-thin'

const weightMap = {
  regular: SmileyWinkRegular,
  bold: SmileyWinkBold,
  duotone: SmileyWinkDuotone,
  fill: SmileyWinkFill,
  light: SmileyWinkLight,
  thin: SmileyWinkThin,
} as const

export const SmileyWink = (props: IconProps) => {
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
