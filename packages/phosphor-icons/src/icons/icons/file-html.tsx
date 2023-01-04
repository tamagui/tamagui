import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileHtmlBold } from '../bold/file-html-bold'
import { FileHtmlDuotone } from '../duotone/file-html-duotone'
import { FileHtmlFill } from '../fill/file-html-fill'
import { FileHtmlLight } from '../light/file-html-light'
import { FileHtmlRegular } from '../regular/file-html-regular'
import { FileHtmlThin } from '../thin/file-html-thin'

const weightMap = {
  regular: FileHtmlRegular,
  bold: FileHtmlBold,
  duotone: FileHtmlDuotone,
  fill: FileHtmlFill,
  light: FileHtmlLight,
  thin: FileHtmlThin,
} as const

export const FileHtml = (props: IconProps) => {
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
