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
      <Path d="M5.8 11.3 2 22l10.7-3.79" stroke={color} />
      <Path d="M4 3h.01" stroke={color} />
      <Path d="M22 8h.01" stroke={color} />
      <Path d="M15 2h.01" stroke={color} />
      <Path d="M22 20h.01" stroke={color} />
      <Path
        d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"
        stroke={color}
      />
      <Path
        d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"
        stroke={color}
      />
      <Path
        d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"
        stroke={color}
      />
      <Path
        d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'PartyPopper'

export const PartyPopper = memo<IconProps>(themed(Icon))
