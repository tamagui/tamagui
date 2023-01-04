import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TelevisionBold } from '../bold/television-bold'
import { TelevisionDuotone } from '../duotone/television-duotone'
import { TelevisionFill } from '../fill/television-fill'
import { TelevisionLight } from '../light/television-light'
import { TelevisionRegular } from '../regular/television-regular'
import { TelevisionThin } from '../thin/television-thin'

const weightMap = {
  regular: TelevisionRegular,
  bold: TelevisionBold,
  duotone: TelevisionDuotone,
  fill: TelevisionFill,
  light: TelevisionLight,
  thin: TelevisionThin,
} as const

export const Television = (props: IconProps) => {
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
