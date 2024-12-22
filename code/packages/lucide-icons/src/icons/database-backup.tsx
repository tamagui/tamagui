import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Ellipse, Path } from 'react-native-svg'
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
      <Ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} />
      <Path d="M3 12a9 3 0 0 0 5 2.69" stroke={color} />
      <Path d="M21 9.3V5" stroke={color} />
      <Path d="M3 5v14a9 3 0 0 0 6.47 2.88" stroke={color} />
      <Path d="M12 12v4h4" stroke={color} />
      <Path
        d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'DatabaseBackup'

export const DatabaseBackup = memo<IconProps>(themed(Icon))
