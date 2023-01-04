import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextAlignRightBold } from '../bold/text-align-right-bold'
import { TextAlignRightDuotone } from '../duotone/text-align-right-duotone'
import { TextAlignRightFill } from '../fill/text-align-right-fill'
import { TextAlignRightLight } from '../light/text-align-right-light'
import { TextAlignRightRegular } from '../regular/text-align-right-regular'
import { TextAlignRightThin } from '../thin/text-align-right-thin'

const weightMap = {
  regular: TextAlignRightRegular,
  bold: TextAlignRightBold,
  duotone: TextAlignRightDuotone,
  fill: TextAlignRightFill,
  light: TextAlignRightLight,
  thin: TextAlignRightThin,
} as const

export const TextAlignRight = (props: IconProps) => {
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
