import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileTsxBold } from '../bold/file-tsx-bold'
import { FileTsxDuotone } from '../duotone/file-tsx-duotone'
import { FileTsxFill } from '../fill/file-tsx-fill'
import { FileTsxLight } from '../light/file-tsx-light'
import { FileTsxRegular } from '../regular/file-tsx-regular'
import { FileTsxThin } from '../thin/file-tsx-thin'

const weightMap = {
  regular: FileTsxRegular,
  bold: FileTsxBold,
  duotone: FileTsxDuotone,
  fill: FileTsxFill,
  light: FileTsxLight,
  thin: FileTsxThin,
} as const

export const FileTsx = (props: IconProps) => {
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
