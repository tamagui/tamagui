import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextAlignJustifyBold } from '../bold/text-align-justify-bold'
import { TextAlignJustifyDuotone } from '../duotone/text-align-justify-duotone'
import { TextAlignJustifyFill } from '../fill/text-align-justify-fill'
import { TextAlignJustifyLight } from '../light/text-align-justify-light'
import { TextAlignJustifyRegular } from '../regular/text-align-justify-regular'
import { TextAlignJustifyThin } from '../thin/text-align-justify-thin'

const weightMap = {
  regular: TextAlignJustifyRegular,
  bold: TextAlignJustifyBold,
  duotone: TextAlignJustifyDuotone,
  fill: TextAlignJustifyFill,
  light: TextAlignJustifyLight,
  thin: TextAlignJustifyThin,
} as const

export const TextAlignJustify = (props: IconProps) => {
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
