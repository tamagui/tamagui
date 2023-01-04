import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TabsBold } from '../bold/tabs-bold'
import { TabsDuotone } from '../duotone/tabs-duotone'
import { TabsFill } from '../fill/tabs-fill'
import { TabsLight } from '../light/tabs-light'
import { TabsRegular } from '../regular/tabs-regular'
import { TabsThin } from '../thin/tabs-thin'

const weightMap = {
  regular: TabsRegular,
  bold: TabsBold,
  duotone: TabsDuotone,
  fill: TabsFill,
  light: TabsLight,
  thin: TabsThin,
} as const

export const Tabs = (props: IconProps) => {
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
