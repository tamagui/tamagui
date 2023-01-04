import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileLockBold } from '../bold/file-lock-bold'
import { FileLockDuotone } from '../duotone/file-lock-duotone'
import { FileLockFill } from '../fill/file-lock-fill'
import { FileLockLight } from '../light/file-lock-light'
import { FileLockRegular } from '../regular/file-lock-regular'
import { FileLockThin } from '../thin/file-lock-thin'

const weightMap = {
  regular: FileLockRegular,
  bold: FileLockBold,
  duotone: FileLockDuotone,
  fill: FileLockFill,
  light: FileLockLight,
  thin: FileLockThin,
} as const

export const FileLock = (props: IconProps) => {
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
