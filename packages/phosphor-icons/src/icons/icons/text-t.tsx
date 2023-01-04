import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextTBold } from '../bold/text-t-bold'
import { TextTDuotone } from '../duotone/text-t-duotone'
import { TextTFill } from '../fill/text-t-fill'
import { TextTLight } from '../light/text-t-light'
import { TextTRegular } from '../regular/text-t-regular'
import { TextTThin } from '../thin/text-t-thin'

const weightMap = {
  regular: TextTRegular,
  bold: TextTBold,
  duotone: TextTDuotone,
  fill: TextTFill,
  light: TextTLight,
  thin: TextTThin,
} as const

export const TextT = (props: IconProps) => {
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
