import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyBold } from '../bold/smiley-bold'
import { SmileyDuotone } from '../duotone/smiley-duotone'
import { SmileyFill } from '../fill/smiley-fill'
import { SmileyLight } from '../light/smiley-light'
import { SmileyRegular } from '../regular/smiley-regular'
import { SmileyThin } from '../thin/smiley-thin'

const weightMap = {
  regular: SmileyRegular,
  bold: SmileyBold,
  duotone: SmileyDuotone,
  fill: SmileyFill,
  light: SmileyLight,
  thin: SmileyThin,
} as const

export const Smiley = (props: IconProps) => {
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
