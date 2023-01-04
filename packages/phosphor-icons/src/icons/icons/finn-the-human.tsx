import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FinnTheHumanBold } from '../bold/finn-the-human-bold'
import { FinnTheHumanDuotone } from '../duotone/finn-the-human-duotone'
import { FinnTheHumanFill } from '../fill/finn-the-human-fill'
import { FinnTheHumanLight } from '../light/finn-the-human-light'
import { FinnTheHumanRegular } from '../regular/finn-the-human-regular'
import { FinnTheHumanThin } from '../thin/finn-the-human-thin'

const weightMap = {
  regular: FinnTheHumanRegular,
  bold: FinnTheHumanBold,
  duotone: FinnTheHumanDuotone,
  fill: FinnTheHumanFill,
  light: FinnTheHumanLight,
  thin: FinnTheHumanThin,
} as const

export const FinnTheHuman = (props: IconProps) => {
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
