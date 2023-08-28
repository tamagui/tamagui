import { Meta, StoryObj } from '@storybook/react'
import { FullscreenSpinner } from './FullscreenSpinner'
import { YStack } from 'tamagui'

const meta: Meta<typeof FullscreenSpinner> = {
  title: 'ui/FullscreenSpinner',
  parameters: { layout: 'fullscreen' },
  component: FullscreenSpinner,
  render: (props) => (
    <YStack height="100%">
      <FullscreenSpinner {...props} />
    </YStack>
  ),
}

type Story = StoryObj<typeof FullscreenSpinner>

export const Basic: Story = {}

export default meta
