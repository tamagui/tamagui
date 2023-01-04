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
      <_Path d="M160,80a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H168A8,8,0,0,1,160,80Zm88,72a8,8,0,0,1-8,8H169a32.1,32.1,0,0,0,31,24,31.5,31.5,0,0,0,22.6-9.4,8,8,0,0,1,11.3,0,7.9,7.9,0,0,1,0,11.3A47.4,47.4,0,0,1,200,200a48,48,0,1,1,48-48Zm-17-8a32,32,0,0,0-62,0Zm-91,14a42,42,0,0,1-42,42H32a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H86a38,38,0,0,1,28.3,63.3A42,42,0,0,1,140,158ZM40,116H86a22,22,0,0,0,0-44H40Zm84,42a26.1,26.1,0,0,0-26-26H40v52H98A26.1,26.1,0,0,0,124,158Z" />
    </_Svg>
  )
}

Icon.displayName = 'BehanceLogoFill'

export const BehanceLogoFill = memo<IconProps>(themed(Icon))
