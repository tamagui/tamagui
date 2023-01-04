import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileTsBold } from '../bold/file-ts-bold'
import { FileTsDuotone } from '../duotone/file-ts-duotone'
import { FileTsFill } from '../fill/file-ts-fill'
import { FileTsLight } from '../light/file-ts-light'
import { FileTsRegular } from '../regular/file-ts-regular'
import { FileTsThin } from '../thin/file-ts-thin'

const weightMap = {
  regular: FileTsRegular,
  bold: FileTsBold,
  duotone: FileTsDuotone,
  fill: FileTsFill,
  light: FileTsLight,
  thin: FileTsThin,
} as const

export const FileTs = (props: IconProps) => {
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
