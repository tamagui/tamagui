import React from "react";
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

      <Rect width="20" height="16" x="2" y="4" rx="2" ry="2" stroke={color} />
      <Path d="M6 8h.001" stroke={color} />
      <Path d="M10 8h.001" stroke={color} />
      <Path d="M14 8h.001" stroke={color} />
      <Path d="M18 8h.001" stroke={color} />
      <Path d="M8 12h.001" stroke={color} />
      <Path d="M12 12h.001" stroke={color} />
      <Path d="M16 12h.001" stroke={color} />
      <Path d="M7 16h10" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Keyboard';

export const Keyboard = React.memo<IconProps>(themed(Icon));