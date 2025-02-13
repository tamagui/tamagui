import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <_Circle cx="12" cy="18" r="3" stroke={color} />
      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <_Circle cx="18" cy="6" r="3" stroke={color} />
      <Path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" stroke={color} />
      <Path d="M12 12v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitFork'

export const GitFork: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
