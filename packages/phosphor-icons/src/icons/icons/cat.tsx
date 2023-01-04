import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CatBold } from '../bold/cat-bold'
import { CatDuotone } from '../duotone/cat-duotone'
import { CatFill } from '../fill/cat-fill'
import { CatLight } from '../light/cat-light'
import { CatRegular } from '../regular/cat-regular'
import { CatThin } from '../thin/cat-thin'

const weightMap = {
  regular: CatRegular,
  bold: CatBold,
  duotone: CatDuotone,
  fill: CatFill,
  light: CatLight,
  thin: CatThin,
} as const

export const Cat = (props: IconProps) => {
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
