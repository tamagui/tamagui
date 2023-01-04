import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LifebuoyBold } from '../bold/lifebuoy-bold'
import { LifebuoyDuotone } from '../duotone/lifebuoy-duotone'
import { LifebuoyFill } from '../fill/lifebuoy-fill'
import { LifebuoyLight } from '../light/lifebuoy-light'
import { LifebuoyRegular } from '../regular/lifebuoy-regular'
import { LifebuoyThin } from '../thin/lifebuoy-thin'

const weightMap = {
  regular: LifebuoyRegular,
  bold: LifebuoyBold,
  duotone: LifebuoyDuotone,
  fill: LifebuoyFill,
  light: LifebuoyLight,
  thin: LifebuoyThin,
} as const

export const Lifebuoy = (props: IconProps) => {
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
