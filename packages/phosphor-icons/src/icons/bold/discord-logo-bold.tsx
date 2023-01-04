import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Circle cx="96" cy="132" r="16" />
      <_Circle cx="160" cy="132" r="16" />
      <_Path
        d="M151.3,174.6l15.8,31.5a7.8,7.8,0,0,0,9,4.2c24.5-6,45.7-16.4,61.1-29.8a8.1,8.1,0,0,0,2.4-8.4L205.7,58.9a7.7,7.7,0,0,0-4.7-5.1,176.4,176.4,0,0,0-29.6-9.2,8.1,8.1,0,0,0-9.4,5.3L151.5,81.5"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M104.7,174.6,88.9,206.1a7.8,7.8,0,0,1-9,4.2c-24.5-6-45.7-16.4-61.1-29.8a8.1,8.1,0,0,1-2.4-8.4L50.3,58.9A7.7,7.7,0,0,1,55,53.8a176.4,176.4,0,0,1,29.6-9.2A8.1,8.1,0,0,1,94,49.9l10.5,31.6"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M181.1,168c-15.2,5.1-33.5,8-53.1,8s-37.9-2.9-53.1-8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M176,86.4A173.7,173.7,0,0,0,128,80a173.7,173.7,0,0,0-48,6.4"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'DiscordLogoBold'

export const DiscordLogoBold = memo<IconProps>(themed(Icon))
