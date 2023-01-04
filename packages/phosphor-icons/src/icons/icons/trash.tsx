import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrashBold } from '../bold/trash-bold'
import { TrashDuotone } from '../duotone/trash-duotone'
import { TrashFill } from '../fill/trash-fill'
import { TrashLight } from '../light/trash-light'
import { TrashRegular } from '../regular/trash-regular'
import { TrashThin } from '../thin/trash-thin'

const weightMap = {
  regular: TrashRegular,
  bold: TrashBold,
  duotone: TrashDuotone,
  fill: TrashFill,
  light: TrashLight,
  thin: TrashThin,
} as const

export const Trash = (props: IconProps) => {
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
