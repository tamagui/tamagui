import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListBulletsBold } from '../bold/list-bullets-bold'
import { ListBulletsDuotone } from '../duotone/list-bullets-duotone'
import { ListBulletsFill } from '../fill/list-bullets-fill'
import { ListBulletsLight } from '../light/list-bullets-light'
import { ListBulletsRegular } from '../regular/list-bullets-regular'
import { ListBulletsThin } from '../thin/list-bullets-thin'

const weightMap = {
  regular: ListBulletsRegular,
  bold: ListBulletsBold,
  duotone: ListBulletsDuotone,
  fill: ListBulletsFill,
  light: ListBulletsLight,
  thin: ListBulletsThin,
} as const

export const ListBullets = (props: IconProps) => {
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
