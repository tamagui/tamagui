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
      <_Circle cx="96" cy="144" r="8" />
      <_Circle cx="160" cy="144" r="8" />
      <_Path
        d="M74.4,80A174.9,174.9,0,0,1,128,72a174.9,174.9,0,0,1,53.6,8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M181.6,176a174.9,174.9,0,0,1-53.6,8,174.9,174.9,0,0,1-53.6-8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M155,182.1l12.1,24a7.8,7.8,0,0,0,9,4.2c24.5-6,45.7-16.4,61.1-29.8a8.1,8.1,0,0,0,2.4-8.4L205.7,58.9a7.7,7.7,0,0,0-4.7-5.1,176.4,176.4,0,0,0-29.6-9.2,8.1,8.1,0,0,0-9.4,5.3l-7.9,23.9"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M101,182.1l-12.1,24a7.8,7.8,0,0,1-9,4.2c-24.5-6-45.7-16.4-61.1-29.8a8.1,8.1,0,0,1-2.4-8.4L50.3,58.9A7.7,7.7,0,0,1,55,53.8a176.4,176.4,0,0,1,29.6-9.2A8.1,8.1,0,0,1,94,49.9l7.9,23.9"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </_Svg>
  )
}

Icon.displayName = 'DiscordLogoThin'

export const DiscordLogoThin = memo<IconProps>(themed(Icon))
