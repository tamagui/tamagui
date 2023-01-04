import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileBold } from '../bold/file-bold'
import { FileDuotone } from '../duotone/file-duotone'
import { FileFill } from '../fill/file-fill'
import { FileLight } from '../light/file-light'
import { FileRegular } from '../regular/file-regular'
import { FileThin } from '../thin/file-thin'

const weightMap = {
  regular: FileRegular,
  bold: FileBold,
  duotone: FileDuotone,
  fill: FileFill,
  light: FileLight,
  thin: FileThin,
} as const

export const File = (props: IconProps) => {
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
