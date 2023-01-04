import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SnowflakeBold } from '../bold/snowflake-bold'
import { SnowflakeDuotone } from '../duotone/snowflake-duotone'
import { SnowflakeFill } from '../fill/snowflake-fill'
import { SnowflakeLight } from '../light/snowflake-light'
import { SnowflakeRegular } from '../regular/snowflake-regular'
import { SnowflakeThin } from '../thin/snowflake-thin'

const weightMap = {
  regular: SnowflakeRegular,
  bold: SnowflakeBold,
  duotone: SnowflakeDuotone,
  fill: SnowflakeFill,
  light: SnowflakeLight,
  thin: SnowflakeThin,
} as const

export const Snowflake = (props: IconProps) => {
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
