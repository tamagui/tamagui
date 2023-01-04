import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileDottedBold } from '../bold/file-dotted-bold'
import { FileDottedDuotone } from '../duotone/file-dotted-duotone'
import { FileDottedFill } from '../fill/file-dotted-fill'
import { FileDottedLight } from '../light/file-dotted-light'
import { FileDottedRegular } from '../regular/file-dotted-regular'
import { FileDottedThin } from '../thin/file-dotted-thin'

const weightMap = {
  regular: FileDottedRegular,
  bold: FileDottedBold,
  duotone: FileDottedDuotone,
  fill: FileDottedFill,
  light: FileDottedLight,
  thin: FileDottedThin,
} as const

export const FileDotted = (props: IconProps) => {
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
