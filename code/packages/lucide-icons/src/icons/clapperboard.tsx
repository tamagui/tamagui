import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path
        d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"
        stroke={color}
      />
      <Path d="m6.2 5.3 3.1 3.9" stroke={color} />
      <Path d="m12.4 3.4 3.1 4" stroke={color} />
      <Path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Clapperboard'

export const Clapperboard = memo<IconProps>(themed(Icon))
