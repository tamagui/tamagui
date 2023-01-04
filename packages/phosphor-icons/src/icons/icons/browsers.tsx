import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BrowsersBold } from '../bold/browsers-bold'
import { BrowsersDuotone } from '../duotone/browsers-duotone'
import { BrowsersFill } from '../fill/browsers-fill'
import { BrowsersLight } from '../light/browsers-light'
import { BrowsersRegular } from '../regular/browsers-regular'
import { BrowsersThin } from '../thin/browsers-thin'

const weightMap = {
  regular: BrowsersRegular,
  bold: BrowsersBold,
  duotone: BrowsersDuotone,
  fill: BrowsersFill,
  light: BrowsersLight,
  thin: BrowsersThin,
} as const

export const Browsers = (props: IconProps) => {
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
