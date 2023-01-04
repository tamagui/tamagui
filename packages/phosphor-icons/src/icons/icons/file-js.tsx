import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileJsBold } from '../bold/file-js-bold'
import { FileJsDuotone } from '../duotone/file-js-duotone'
import { FileJsFill } from '../fill/file-js-fill'
import { FileJsLight } from '../light/file-js-light'
import { FileJsRegular } from '../regular/file-js-regular'
import { FileJsThin } from '../thin/file-js-thin'

const weightMap = {
  regular: FileJsRegular,
  bold: FileJsBold,
  duotone: FileJsDuotone,
  fill: FileJsFill,
  light: FileJsLight,
  thin: FileJsThin,
} as const

export const FileJs = (props: IconProps) => {
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
