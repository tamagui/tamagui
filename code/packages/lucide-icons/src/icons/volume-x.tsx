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

      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} />
      <Line x1="22" x2="16" y1="9" y2="15" stroke={color} />
      <Line x1="16" x2="22" y1="9" y2="15" stroke={color} />
    </Svg>);

};

Icon.displayName = 'VolumeX';

export const VolumeX = React.memo<IconProps>(themed(Icon));