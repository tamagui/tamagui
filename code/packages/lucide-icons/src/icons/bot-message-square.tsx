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
      <Path d="M12 6V2H8" stroke={color} />
      <Path
        d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"
        stroke={color}
      />
      <Path d="M2 12h2" stroke={color} />
      <Path d="M9 11v2" stroke={color} />
      <Path d="M15 11v2" stroke={color} />
      <Path d="M20 12h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BotMessageSquare'

export const BotMessageSquare = memo<IconProps>(themed(Icon))
