import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilePlusBold } from '../bold/file-plus-bold'
import { FilePlusDuotone } from '../duotone/file-plus-duotone'
import { FilePlusFill } from '../fill/file-plus-fill'
import { FilePlusLight } from '../light/file-plus-light'
import { FilePlusRegular } from '../regular/file-plus-regular'
import { FilePlusThin } from '../thin/file-plus-thin'

const weightMap = {
  regular: FilePlusRegular,
  bold: FilePlusBold,
  duotone: FilePlusDuotone,
  fill: FilePlusFill,
  light: FilePlusLight,
  thin: FilePlusThin,
} as const

export const FilePlus = (props: IconProps) => {
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
