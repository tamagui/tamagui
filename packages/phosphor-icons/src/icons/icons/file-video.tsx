import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileVideoBold } from '../bold/file-video-bold'
import { FileVideoDuotone } from '../duotone/file-video-duotone'
import { FileVideoFill } from '../fill/file-video-fill'
import { FileVideoLight } from '../light/file-video-light'
import { FileVideoRegular } from '../regular/file-video-regular'
import { FileVideoThin } from '../thin/file-video-thin'

const weightMap = {
  regular: FileVideoRegular,
  bold: FileVideoBold,
  duotone: FileVideoDuotone,
  fill: FileVideoFill,
  light: FileVideoLight,
  thin: FileVideoThin,
} as const

export const FileVideo = (props: IconProps) => {
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
