import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NewspaperBold } from '../bold/newspaper-bold'
import { NewspaperDuotone } from '../duotone/newspaper-duotone'
import { NewspaperFill } from '../fill/newspaper-fill'
import { NewspaperLight } from '../light/newspaper-light'
import { NewspaperRegular } from '../regular/newspaper-regular'
import { NewspaperThin } from '../thin/newspaper-thin'

const weightMap = {
  regular: NewspaperRegular,
  bold: NewspaperBold,
  duotone: NewspaperDuotone,
  fill: NewspaperFill,
  light: NewspaperLight,
  thin: NewspaperThin,
} as const

export const Newspaper = (props: IconProps) => {
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
