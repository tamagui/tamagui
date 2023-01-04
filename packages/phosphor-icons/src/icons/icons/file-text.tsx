import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileTextBold } from '../bold/file-text-bold'
import { FileTextDuotone } from '../duotone/file-text-duotone'
import { FileTextFill } from '../fill/file-text-fill'
import { FileTextLight } from '../light/file-text-light'
import { FileTextRegular } from '../regular/file-text-regular'
import { FileTextThin } from '../thin/file-text-thin'

const weightMap = {
  regular: FileTextRegular,
  bold: FileTextBold,
  duotone: FileTextDuotone,
  fill: FileTextFill,
  light: FileTextLight,
  thin: FileTextThin,
} as const

export const FileText = (props: IconProps) => {
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
