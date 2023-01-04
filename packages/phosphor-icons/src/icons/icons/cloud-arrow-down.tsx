import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudArrowDownBold } from '../bold/cloud-arrow-down-bold'
import { CloudArrowDownDuotone } from '../duotone/cloud-arrow-down-duotone'
import { CloudArrowDownFill } from '../fill/cloud-arrow-down-fill'
import { CloudArrowDownLight } from '../light/cloud-arrow-down-light'
import { CloudArrowDownRegular } from '../regular/cloud-arrow-down-regular'
import { CloudArrowDownThin } from '../thin/cloud-arrow-down-thin'

const weightMap = {
  regular: CloudArrowDownRegular,
  bold: CloudArrowDownBold,
  duotone: CloudArrowDownDuotone,
  fill: CloudArrowDownFill,
  light: CloudArrowDownLight,
  thin: CloudArrowDownThin,
} as const

export const CloudArrowDown = (props: IconProps) => {
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
