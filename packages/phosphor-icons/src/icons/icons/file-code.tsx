import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileCodeBold } from '../bold/file-code-bold'
import { FileCodeDuotone } from '../duotone/file-code-duotone'
import { FileCodeFill } from '../fill/file-code-fill'
import { FileCodeLight } from '../light/file-code-light'
import { FileCodeRegular } from '../regular/file-code-regular'
import { FileCodeThin } from '../thin/file-code-thin'

const weightMap = {
  regular: FileCodeRegular,
  bold: FileCodeBold,
  duotone: FileCodeDuotone,
  fill: FileCodeFill,
  light: FileCodeLight,
  thin: FileCodeThin,
} as const

export const FileCode = (props: IconProps) => {
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
