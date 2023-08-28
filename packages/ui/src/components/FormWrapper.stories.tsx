import { Meta, StoryObj } from '@storybook/react'
import { Button, Fieldset, Input, Label, YStack } from 'tamagui'
import { FormWrapper } from './FormWrapper'

const meta: Meta<typeof FormWrapper> = {
  title: 'ui/FormWrapper',
  parameters: { layout: 'centered' },
  component: FormWrapper,
}

type Story = StoryObj<typeof FormWrapper>

export const Basic: Story = {
  render: () => {
    return (
      <YStack flex={1} $gtMd={{ width: 300 }}>
        <FormWrapper>
          <FormWrapper.Body>
            <Fieldset gap="$2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" />
            </Fieldset>
          </FormWrapper.Body>

          {/* the footer will be pushed to the bottom */}
          <FormWrapper.Footer>
            <Button themeInverse borderRadius="$10">
              Submit
            </Button>
          </FormWrapper.Footer>
        </FormWrapper>
      </YStack>
    )
  },
}

export default meta
