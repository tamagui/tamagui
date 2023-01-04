import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileXBold } from '../bold/file-x-bold'
import { FileXDuotone } from '../duotone/file-x-duotone'
import { FileXFill } from '../fill/file-x-fill'
import { FileXLight } from '../light/file-x-light'
import { FileXRegular } from '../regular/file-x-regular'
import { FileXThin } from '../thin/file-x-thin'

const weightMap = {
  regular: FileXRegular,
  bold: FileXBold,
  duotone: FileXDuotone,
  fill: FileXFill,
  light: FileXLight,
  thin: FileXThin,
} as const

export const FileX = (props: IconProps) => {
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
