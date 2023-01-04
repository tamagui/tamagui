import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BracketsCurlyBold } from '../bold/brackets-curly-bold'
import { BracketsCurlyDuotone } from '../duotone/brackets-curly-duotone'
import { BracketsCurlyFill } from '../fill/brackets-curly-fill'
import { BracketsCurlyLight } from '../light/brackets-curly-light'
import { BracketsCurlyRegular } from '../regular/brackets-curly-regular'
import { BracketsCurlyThin } from '../thin/brackets-curly-thin'

const weightMap = {
  regular: BracketsCurlyRegular,
  bold: BracketsCurlyBold,
  duotone: BracketsCurlyDuotone,
  fill: BracketsCurlyFill,
  light: BracketsCurlyLight,
  thin: BracketsCurlyThin,
} as const

export const BracketsCurly = (props: IconProps) => {
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
