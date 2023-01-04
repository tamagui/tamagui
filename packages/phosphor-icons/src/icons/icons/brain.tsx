import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BrainBold } from '../bold/brain-bold'
import { BrainDuotone } from '../duotone/brain-duotone'
import { BrainFill } from '../fill/brain-fill'
import { BrainLight } from '../light/brain-light'
import { BrainRegular } from '../regular/brain-regular'
import { BrainThin } from '../thin/brain-thin'

const weightMap = {
  regular: BrainRegular,
  bold: BrainBold,
  duotone: BrainDuotone,
  fill: BrainFill,
  light: BrainLight,
  thin: BrainThin,
} as const

export const Brain = (props: IconProps) => {
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
