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

      <Path d="M8 2v4" stroke={color} />
      <Path d="M12 2v4" stroke={color} />
      <Path d="M16 2v4" stroke={color} />
      <Rect width="16" height="18" x="4" y="4" rx="2" stroke={color} />
      <Path d="M8 10h6" stroke={color} />
      <Path d="M8 14h8" stroke={color} />
      <Path d="M8 18h5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'NotepadText';

export const NotepadText = React.memo<IconProps>(themed(Icon));