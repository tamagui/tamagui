import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PencilBold } from '../bold/pencil-bold'
import { PencilDuotone } from '../duotone/pencil-duotone'
import { PencilFill } from '../fill/pencil-fill'
import { PencilLight } from '../light/pencil-light'
import { PencilRegular } from '../regular/pencil-regular'
import { PencilThin } from '../thin/pencil-thin'

const weightMap = {
  regular: PencilRegular,
  bold: PencilBold,
  duotone: PencilDuotone,
  fill: PencilFill,
  light: PencilLight,
  thin: PencilThin,
} as const

export const Pencil = (props: IconProps) => {
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
