import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BandaidsBold } from '../bold/bandaids-bold'
import { BandaidsDuotone } from '../duotone/bandaids-duotone'
import { BandaidsFill } from '../fill/bandaids-fill'
import { BandaidsLight } from '../light/bandaids-light'
import { BandaidsRegular } from '../regular/bandaids-regular'
import { BandaidsThin } from '../thin/bandaids-thin'

const weightMap = {
  regular: BandaidsRegular,
  bold: BandaidsBold,
  duotone: BandaidsDuotone,
  fill: BandaidsFill,
  light: BandaidsLight,
  thin: BandaidsThin,
} as const

export const Bandaids = (props: IconProps) => {
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
