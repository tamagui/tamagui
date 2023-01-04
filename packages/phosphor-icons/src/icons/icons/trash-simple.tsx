import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrashSimpleBold } from '../bold/trash-simple-bold'
import { TrashSimpleDuotone } from '../duotone/trash-simple-duotone'
import { TrashSimpleFill } from '../fill/trash-simple-fill'
import { TrashSimpleLight } from '../light/trash-simple-light'
import { TrashSimpleRegular } from '../regular/trash-simple-regular'
import { TrashSimpleThin } from '../thin/trash-simple-thin'

const weightMap = {
  regular: TrashSimpleRegular,
  bold: TrashSimpleBold,
  duotone: TrashSimpleDuotone,
  fill: TrashSimpleFill,
  light: TrashSimpleLight,
  thin: TrashSimpleThin,
} as const

export const TrashSimple = (props: IconProps) => {
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
