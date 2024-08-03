import * as React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
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
      {...otherProps}>

      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
      <Path d="M8.5 16.5a5 5 0 0 1 7 0" stroke={color} />
      <Path d="M2 8.82a15 15 0 0 1 4.17-2.65" stroke={color} />
      <Path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" stroke={color} />
      <Path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" stroke={color} />
      <Path d="M5 13a10 10 0 0 1 5.24-2.76" stroke={color} />
      <Line x1="12" x2="12.01" y1="20" y2="20" stroke={color} />
    </Svg>);

};

Icon.displayName = 'WifiOff';

export const WifiOff = React.memo<IconProps>(themed(Icon));