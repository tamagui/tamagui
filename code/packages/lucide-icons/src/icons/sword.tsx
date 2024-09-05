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

      <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" stroke={color} />
      <Line x1="13" x2="19" y1="19" y2="13" stroke={color} />
      <Line x1="16" x2="20" y1="16" y2="20" stroke={color} />
      <Line x1="19" x2="21" y1="21" y2="19" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Sword';

export const Sword = React.memo<IconProps>(themed(Icon));