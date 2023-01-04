import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHSixBold } from '../bold/text-h-six-bold'
import { TextHSixDuotone } from '../duotone/text-h-six-duotone'
import { TextHSixFill } from '../fill/text-h-six-fill'
import { TextHSixLight } from '../light/text-h-six-light'
import { TextHSixRegular } from '../regular/text-h-six-regular'
import { TextHSixThin } from '../thin/text-h-six-thin'

const weightMap = {
  regular: TextHSixRegular,
  bold: TextHSixBold,
  duotone: TextHSixDuotone,
  fill: TextHSixFill,
  light: TextHSixLight,
  thin: TextHSixThin,
} as const

export const TextHSix = (props: IconProps) => {
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
