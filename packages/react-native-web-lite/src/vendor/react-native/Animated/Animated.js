/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
import { Platform } from 'react-native-web-internals'

import Impl from './AnimatedImplementation.js'
import Mock from './AnimatedMock.js'
import Image from './components/AnimatedImage.js'
import ScrollView from './components/AnimatedScrollView.js'
import Text from './components/AnimatedText.js'
import View from './components/AnimatedView.js'

export const Animated = {
  Platform,
  Image,
  ScrollView,
  Text,
  View,
  ...(Platform.isTesting ? Mock : Impl),
}
