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

      <Path d="M15 4V2" stroke={color} />
      <Path d="M15 16v-2" stroke={color} />
      <Path d="M8 9h2" stroke={color} />
      <Path d="M20 9h2" stroke={color} />
      <Path d="M17.8 11.8 19 13" stroke={color} />
      <Path d="M15 9h0" stroke={color} />
      <Path d="M17.8 6.2 19 5" stroke={color} />
      <Path d="m3 21 9-9" stroke={color} />
      <Path d="M12.2 6.2 11 5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Wand';

export const Wand = React.memo<IconProps>(themed(Icon));