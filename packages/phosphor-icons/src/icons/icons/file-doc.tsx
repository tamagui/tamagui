import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileDocBold } from '../bold/file-doc-bold'
import { FileDocDuotone } from '../duotone/file-doc-duotone'
import { FileDocFill } from '../fill/file-doc-fill'
import { FileDocLight } from '../light/file-doc-light'
import { FileDocRegular } from '../regular/file-doc-regular'
import { FileDocThin } from '../thin/file-doc-thin'

const weightMap = {
  regular: FileDocRegular,
  bold: FileDocBold,
  duotone: FileDocDuotone,
  fill: FileDocFill,
  light: FileDocLight,
  thin: FileDocThin,
} as const

export const FileDoc = (props: IconProps) => {
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
