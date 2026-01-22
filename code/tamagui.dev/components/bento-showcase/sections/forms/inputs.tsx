import { View, YStack } from 'tamagui'

import * as Inputs from '@tamagui/bento/component/forms/inputs'
import { Showcase, WithSize } from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function inputs({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          isInput
          short
          fileName={Inputs.InputWithLabelDemo.fileName}
          title="Input with Label"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithLabelDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.OneTimeCodeInputExample.fileName}
          title="One-Time Code Input"
        >
          <View py="$15">
            <WithSize>
              <Inputs.OneTimeCodeInputExample />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithLabelAndMessageDemo.fileName}
          title="Input with Label and Message"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithLabelAndMessageDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithErrorDemo.fileName}
          title="Input with Error"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithErrorDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithLeftIconDemo.fileName}
          title="Input Left Adornment"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithLeftIconDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithRightIconDemo.fileName}
          title="Input Right Adornment"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithRightIconDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputBothSideIconsExample.fileName}
          title="Input Left/Right Adornment"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputBothSideIconsExample />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputGroupedIconsExample.fileName}
          title="Grouped Input with Buttons"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputGroupedIconsExample />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithRightAddOnDemo.fileName}
          title="Grouped Input with Buttons (Alt)"
        >
          <View py="$8">
            <WithSize>
              <Inputs.InputWithRightAddOnDemo />
            </WithSize>
          </View>
        </Showcase>
        <Showcase
          short
          isInput
          fileName={Inputs.PhoneInputExample.fileName}
          title="Phone"
        >
          <View py="$8">
            <WithSize>
              <Inputs.PhoneInputExample />
            </WithSize>
          </View>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}
