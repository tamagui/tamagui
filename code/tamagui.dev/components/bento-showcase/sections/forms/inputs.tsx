import { Stack, YStack } from 'tamagui'

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
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithLabelDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.OneTimeCodeInputExample.fileName}
          title="One-Time Code Input"
        >
          <Stack py="$15">
            <WithSize>
              <Inputs.OneTimeCodeInputExample />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithLabelAndMessageDemo.fileName}
          title="Input with Label and Message"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithLabelAndMessageDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithErrorDemo.fileName}
          title="Input with Error"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithErrorDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithLeftIconDemo.fileName}
          title="Input Left Adornment"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithLeftIconDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithRightIconDemo.fileName}
          title="Input Right Adornment"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithRightIconDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputBothSideIconsExample.fileName}
          title="Input Left/Right Adornment"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputBothSideIconsExample />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputGroupedIconsExample.fileName}
          title="Grouped Input with Buttons"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputGroupedIconsExample />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          isInput
          short
          fileName={Inputs.InputWithRightAddOnDemo.fileName}
          title="Grouped Input with Buttons (Alt)"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.InputWithRightAddOnDemo />
            </WithSize>
          </Stack>
        </Showcase>
        <Showcase
          short
          isInput
          fileName={Inputs.PhoneInputExample.fileName}
          title="Phone"
        >
          <Stack py="$8">
            <WithSize>
              <Inputs.PhoneInputExample />
            </WithSize>
          </Stack>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}
