import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilesBold } from '../bold/files-bold'
import { FilesDuotone } from '../duotone/files-duotone'
import { FilesFill } from '../fill/files-fill'
import { FilesLight } from '../light/files-light'
import { FilesRegular } from '../regular/files-regular'
import { FilesThin } from '../thin/files-thin'

const weightMap = {
  regular: FilesRegular,
  bold: FilesBold,
  duotone: FilesDuotone,
  fill: FilesFill,
  light: FilesLight,
  thin: FilesThin,
} as const

export const Files = (props: IconProps) => {
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
