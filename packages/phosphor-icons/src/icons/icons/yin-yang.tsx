import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { YinYangBold } from '../bold/yin-yang-bold'
import { YinYangDuotone } from '../duotone/yin-yang-duotone'
import { YinYangFill } from '../fill/yin-yang-fill'
import { YinYangLight } from '../light/yin-yang-light'
import { YinYangRegular } from '../regular/yin-yang-regular'
import { YinYangThin } from '../thin/yin-yang-thin'

const weightMap = {
  regular: YinYangRegular,
  bold: YinYangBold,
  duotone: YinYangDuotone,
  fill: YinYangFill,
  light: YinYangLight,
  thin: YinYangThin,
} as const

export const YinYang = (props: IconProps) => {
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
