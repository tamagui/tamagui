//! debug-verbose
import './wdyr'

import { View, useMedia } from 'tamagui'
// import { DatePickerExample } from '../../bento/src/components/elements/datepickers/DatePicker'

import { View as RNView } from 'react-native'

export const Sandbox = () => {
  const media = useMedia()

  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      {/* <Demo3 /> */}
      {/* <Circle
        debug="verbose"
        size={100}
        bg="red"
        animation="bouncy"
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      /> */}

      {/* <SliderDemo /> */}

      <View
        w={100}
        h={100}
        enterStyle={media.lg ? {} : {}}
        background={media.sm ? 'red' : 'yellow'}
      />

      {/* <DatePickerExample /> */}
    </RNView>
  )
}
