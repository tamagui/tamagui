import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileJsxBold } from '../bold/file-jsx-bold'
import { FileJsxDuotone } from '../duotone/file-jsx-duotone'
import { FileJsxFill } from '../fill/file-jsx-fill'
import { FileJsxLight } from '../light/file-jsx-light'
import { FileJsxRegular } from '../regular/file-jsx-regular'
import { FileJsxThin } from '../thin/file-jsx-thin'

const weightMap = {
  regular: FileJsxRegular,
  bold: FileJsxBold,
  duotone: FileJsxDuotone,
  fill: FileJsxFill,
  light: FileJsxLight,
  thin: FileJsxThin,
} as const

export const FileJsx = (props: IconProps) => {
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
