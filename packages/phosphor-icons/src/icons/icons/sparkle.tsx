import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SparkleBold } from '../bold/sparkle-bold'
import { SparkleDuotone } from '../duotone/sparkle-duotone'
import { SparkleFill } from '../fill/sparkle-fill'
import { SparkleLight } from '../light/sparkle-light'
import { SparkleRegular } from '../regular/sparkle-regular'
import { SparkleThin } from '../thin/sparkle-thin'

const weightMap = {
  regular: SparkleRegular,
  bold: SparkleBold,
  duotone: SparkleDuotone,
  fill: SparkleFill,
  light: SparkleLight,
  thin: SparkleThin,
} as const

export const Sparkle = (props: IconProps) => {
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
