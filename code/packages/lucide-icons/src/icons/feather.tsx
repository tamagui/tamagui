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

      <Path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" stroke={color} />
      <Line x1="16" x2="2" y1="8" y2="22" stroke={color} />
      <Line x1="17.5" x2="9" y1="15" y2="15" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Feather';

export const Feather = React.memo<IconProps>(themed(Icon));