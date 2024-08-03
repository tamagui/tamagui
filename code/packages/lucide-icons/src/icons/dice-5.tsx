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

      <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke={color} />
      <Path d="M16 8h.01" stroke={color} />
      <Path d="M8 8h.01" stroke={color} />
      <Path d="M8 16h.01" stroke={color} />
      <Path d="M16 16h.01" stroke={color} />
      <Path d="M12 12h.01" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Dice5';

export const Dice5 = React.memo<IconProps>(themed(Icon));