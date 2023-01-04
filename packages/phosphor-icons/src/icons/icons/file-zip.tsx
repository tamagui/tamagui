import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileZipBold } from '../bold/file-zip-bold'
import { FileZipDuotone } from '../duotone/file-zip-duotone'
import { FileZipFill } from '../fill/file-zip-fill'
import { FileZipLight } from '../light/file-zip-light'
import { FileZipRegular } from '../regular/file-zip-regular'
import { FileZipThin } from '../thin/file-zip-thin'

const weightMap = {
  regular: FileZipRegular,
  bold: FileZipBold,
  duotone: FileZipDuotone,
  fill: FileZipFill,
  light: FileZipLight,
  thin: FileZipThin,
} as const

export const FileZip = (props: IconProps) => {
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
