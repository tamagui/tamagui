import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PencilLineBold } from '../bold/pencil-line-bold'
import { PencilLineDuotone } from '../duotone/pencil-line-duotone'
import { PencilLineFill } from '../fill/pencil-line-fill'
import { PencilLineLight } from '../light/pencil-line-light'
import { PencilLineRegular } from '../regular/pencil-line-regular'
import { PencilLineThin } from '../thin/pencil-line-thin'

const weightMap = {
  regular: PencilLineRegular,
  bold: PencilLineBold,
  duotone: PencilLineDuotone,
  fill: PencilLineFill,
  light: PencilLineLight,
  thin: PencilLineThin,
} as const

export const PencilLine = (props: IconProps) => {
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
