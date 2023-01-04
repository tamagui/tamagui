import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WaveSquareBold } from '../bold/wave-square-bold'
import { WaveSquareDuotone } from '../duotone/wave-square-duotone'
import { WaveSquareFill } from '../fill/wave-square-fill'
import { WaveSquareLight } from '../light/wave-square-light'
import { WaveSquareRegular } from '../regular/wave-square-regular'
import { WaveSquareThin } from '../thin/wave-square-thin'

const weightMap = {
  regular: WaveSquareRegular,
  bold: WaveSquareBold,
  duotone: WaveSquareDuotone,
  fill: WaveSquareFill,
  light: WaveSquareLight,
  thin: WaveSquareThin,
} as const

export const WaveSquare = (props: IconProps) => {
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
