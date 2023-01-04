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
      <_Path d="M136,24V48a8,8,0,0,1-16,0V24a8,8,0,0,1,16,0Zm40,36a8,8,0,0,0-8,8V92a8,8,0,0,0,16,0V68A8,8,0,0,0,176,60ZM128,200a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V208A8,8,0,0,0,128,200Zm0-128a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,128,72ZM80,60a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V68A8,8,0,0,0,80,60Zm96,56a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V124A8,8,0,0,0,176,116ZM32,108a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V116A8,8,0,0,0,32,108Zm48,48a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V164A8,8,0,0,0,80,156Zm144-48a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V116A8,8,0,0,0,224,108Z" />
    </_Svg>
  )
}

Icon.displayName = 'GooglePodcastsLogoFill'

export const GooglePodcastsLogoFill = memo<IconProps>(themed(Icon))
