/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Platform } from '@tamagui/react-native-web-internals'
import { AnimatedImplementation } from './AnimatedImplementation'
import { AnimatedMock } from './AnimatedMock'
import { FlatList } from './components/AnimatedFlatList'
import { AnimatedImage as Image } from './components/AnimatedImage'
import { ScrollView } from './components/AnimatedScrollView'
import { SectionList } from './components/AnimatedSectionList'
import { AnimatedText as Text } from './components/AnimatedText'
import { AnimatedView as View } from './components/AnimatedView'

const Animated = Platform.isTesting ? AnimatedMock : AnimatedImplementation

const AnimatedExports = {
  FlatList,
  Image,
  ScrollView,
  SectionList,
  Text,
  View,
  ...Animated,
};

export { AnimatedExports }
export default AnimatedExports
  