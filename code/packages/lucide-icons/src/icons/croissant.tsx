import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
        d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"
        stroke={color}
      />
      <Path
        d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"
        stroke={color}
      />
      <Path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4" stroke={color} />
      <Path
        d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"
        stroke={color}
      />
      <Path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Croissant'

export const Croissant: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
