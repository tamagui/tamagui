import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextAaBold } from '../bold/text-aa-bold'
import { TextAaDuotone } from '../duotone/text-aa-duotone'
import { TextAaFill } from '../fill/text-aa-fill'
import { TextAaLight } from '../light/text-aa-light'
import { TextAaRegular } from '../regular/text-aa-regular'
import { TextAaThin } from '../thin/text-aa-thin'

const weightMap = {
  regular: TextAaRegular,
  bold: TextAaBold,
  duotone: TextAaDuotone,
  fill: TextAaFill,
  light: TextAaLight,
  thin: TextAaThin,
} as const

export const TextAa = (props: IconProps) => {
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
