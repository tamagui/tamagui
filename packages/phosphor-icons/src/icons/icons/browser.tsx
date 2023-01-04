import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BrowserBold } from '../bold/browser-bold'
import { BrowserDuotone } from '../duotone/browser-duotone'
import { BrowserFill } from '../fill/browser-fill'
import { BrowserLight } from '../light/browser-light'
import { BrowserRegular } from '../regular/browser-regular'
import { BrowserThin } from '../thin/browser-thin'

const weightMap = {
  regular: BrowserRegular,
  bold: BrowserBold,
  duotone: BrowserDuotone,
  fill: BrowserFill,
  light: BrowserLight,
  thin: BrowserThin,
} as const

export const Browser = (props: IconProps) => {
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
