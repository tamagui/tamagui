import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PencilSimpleLineBold } from '../bold/pencil-simple-line-bold'
import { PencilSimpleLineDuotone } from '../duotone/pencil-simple-line-duotone'
import { PencilSimpleLineFill } from '../fill/pencil-simple-line-fill'
import { PencilSimpleLineLight } from '../light/pencil-simple-line-light'
import { PencilSimpleLineRegular } from '../regular/pencil-simple-line-regular'
import { PencilSimpleLineThin } from '../thin/pencil-simple-line-thin'

const weightMap = {
  regular: PencilSimpleLineRegular,
  bold: PencilSimpleLineBold,
  duotone: PencilSimpleLineDuotone,
  fill: PencilSimpleLineFill,
  light: PencilSimpleLineLight,
  thin: PencilSimpleLineThin,
} as const

export const PencilSimpleLine = (props: IconProps) => {
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
