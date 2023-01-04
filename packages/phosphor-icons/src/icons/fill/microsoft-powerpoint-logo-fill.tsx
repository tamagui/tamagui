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
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M102,120a8,8,0,0,0-8-8H86v16h8A8,8,0,0,0,102,120Z" />
      <_Path d="M136,24A104.5,104.5,0,0,0,54,64H40A16,16,0,0,0,24,80v96a16,16,0,0,0,16,16H54A104,104,0,1,0,136,24ZM70,152V104a8,8,0,0,1,8-8H94a24,24,0,0,1,0,48H86v8a8,8,0,0,1-16,0Zm58,63.6A88.7,88.7,0,0,1,75.6,192H128ZM128,64H75.6A88.7,88.7,0,0,1,128,40.4Zm16-23.6A88,88,0,0,1,223.6,120H160V80a16,16,0,0,0-16-16Zm0,175.2V192a16,16,0,0,0,16-16V136h63.6A88,88,0,0,1,144,215.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'MicrosoftPowerpointLogoFill'

export const MicrosoftPowerpointLogoFill = memo<IconProps>(themed(Icon))
