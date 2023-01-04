import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FloppyDiskBackBold } from '../bold/floppy-disk-back-bold'
import { FloppyDiskBackDuotone } from '../duotone/floppy-disk-back-duotone'
import { FloppyDiskBackFill } from '../fill/floppy-disk-back-fill'
import { FloppyDiskBackLight } from '../light/floppy-disk-back-light'
import { FloppyDiskBackRegular } from '../regular/floppy-disk-back-regular'
import { FloppyDiskBackThin } from '../thin/floppy-disk-back-thin'

const weightMap = {
  regular: FloppyDiskBackRegular,
  bold: FloppyDiskBackBold,
  duotone: FloppyDiskBackDuotone,
  fill: FloppyDiskBackFill,
  light: FloppyDiskBackLight,
  thin: FloppyDiskBackThin,
} as const

export const FloppyDiskBack = (props: IconProps) => {
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
