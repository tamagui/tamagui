import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DropBold } from '../bold/drop-bold'
import { DropDuotone } from '../duotone/drop-duotone'
import { DropFill } from '../fill/drop-fill'
import { DropLight } from '../light/drop-light'
import { DropRegular } from '../regular/drop-regular'
import { DropThin } from '../thin/drop-thin'

const weightMap = {
  regular: DropRegular,
  bold: DropBold,
  duotone: DropDuotone,
  fill: DropFill,
  light: DropLight,
  thin: DropThin,
} as const

export const Drop = (props: IconProps) => {
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
