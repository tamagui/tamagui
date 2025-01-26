import { Stack, YStack } from 'tamagui'

import * as Inputs from '../../components/forms/inputs'
import { Showcase, WithSize } from '../../components/general/_Showcase'

export function inputs() {
  return (
    <YStack paddingBottom="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
        isInput
        short
        fileName={Inputs.InputWithLabelDemo.fileName}
        title="Input with Label"
      >
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$15">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
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
        <Stack paddingVertical="$8">
          <WithSize>
            <Inputs.InputWithRightAddOnDemo />
          </WithSize>
        </Stack>
      </Showcase>
      <Showcase short isInput fileName={Inputs.PhoneInputExample.fileName} title="Phone">
        <Stack paddingVertical="$8">
          <WithSize>
            <Inputs.PhoneInputExample />
          </WithSize>
        </Stack>
      </Showcase>
    </YStack>
  )
}
