import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FloppyDiskBold } from '../bold/floppy-disk-bold'
import { FloppyDiskDuotone } from '../duotone/floppy-disk-duotone'
import { FloppyDiskFill } from '../fill/floppy-disk-fill'
import { FloppyDiskLight } from '../light/floppy-disk-light'
import { FloppyDiskRegular } from '../regular/floppy-disk-regular'
import { FloppyDiskThin } from '../thin/floppy-disk-thin'

const weightMap = {
  regular: FloppyDiskRegular,
  bold: FloppyDiskBold,
  duotone: FloppyDiskDuotone,
  fill: FloppyDiskFill,
  light: FloppyDiskLight,
  thin: FloppyDiskThin,
} as const

export const FloppyDisk = (props: IconProps) => {
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
