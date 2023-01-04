import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHFourBold } from '../bold/text-h-four-bold'
import { TextHFourDuotone } from '../duotone/text-h-four-duotone'
import { TextHFourFill } from '../fill/text-h-four-fill'
import { TextHFourLight } from '../light/text-h-four-light'
import { TextHFourRegular } from '../regular/text-h-four-regular'
import { TextHFourThin } from '../thin/text-h-four-thin'

const weightMap = {
  regular: TextHFourRegular,
  bold: TextHFourBold,
  duotone: TextHFourDuotone,
  fill: TextHFourFill,
  light: TextHFourLight,
  thin: TextHFourThin,
} as const

export const TextHFour = (props: IconProps) => {
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
