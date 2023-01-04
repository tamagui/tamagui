import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileImageBold } from '../bold/file-image-bold'
import { FileImageDuotone } from '../duotone/file-image-duotone'
import { FileImageFill } from '../fill/file-image-fill'
import { FileImageLight } from '../light/file-image-light'
import { FileImageRegular } from '../regular/file-image-regular'
import { FileImageThin } from '../thin/file-image-thin'

const weightMap = {
  regular: FileImageRegular,
  bold: FileImageBold,
  duotone: FileImageDuotone,
  fill: FileImageFill,
  light: FileImageLight,
  thin: FileImageThin,
} as const

export const FileImage = (props: IconProps) => {
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
