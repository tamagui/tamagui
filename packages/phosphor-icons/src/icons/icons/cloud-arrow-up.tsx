import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudArrowUpBold } from '../bold/cloud-arrow-up-bold'
import { CloudArrowUpDuotone } from '../duotone/cloud-arrow-up-duotone'
import { CloudArrowUpFill } from '../fill/cloud-arrow-up-fill'
import { CloudArrowUpLight } from '../light/cloud-arrow-up-light'
import { CloudArrowUpRegular } from '../regular/cloud-arrow-up-regular'
import { CloudArrowUpThin } from '../thin/cloud-arrow-up-thin'

const weightMap = {
  regular: CloudArrowUpRegular,
  bold: CloudArrowUpBold,
  duotone: CloudArrowUpDuotone,
  fill: CloudArrowUpFill,
  light: CloudArrowUpLight,
  thin: CloudArrowUpThin,
} as const

export const CloudArrowUp = (props: IconProps) => {
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
