import { memo } from 'react'
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
      <Path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" stroke={color} />
      <Path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" stroke={color} />
      <_Circle cx="12" cy="12" r="1" stroke={color} />
      <Path
        d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'View'

export const View = memo<IconProps>(themed(Icon))
