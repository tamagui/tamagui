import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileArrowUpBold } from '../bold/file-arrow-up-bold'
import { FileArrowUpDuotone } from '../duotone/file-arrow-up-duotone'
import { FileArrowUpFill } from '../fill/file-arrow-up-fill'
import { FileArrowUpLight } from '../light/file-arrow-up-light'
import { FileArrowUpRegular } from '../regular/file-arrow-up-regular'
import { FileArrowUpThin } from '../thin/file-arrow-up-thin'

const weightMap = {
  regular: FileArrowUpRegular,
  bold: FileArrowUpBold,
  duotone: FileArrowUpDuotone,
  fill: FileArrowUpFill,
  light: FileArrowUpLight,
  thin: FileArrowUpThin,
} as const

export const FileArrowUp = (props: IconProps) => {
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
