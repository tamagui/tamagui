import { Meta, StoryObj } from '@storybook/react'
import { Circle } from 'tamagui'
import { Shake } from './Shake'

const meta: Meta<typeof Shake> = {
  title: 'ui/Shake',
  parameters: { layout: 'centered' },
  component: Shake,
  render: (props) => (
    <Shake {...props}>
      <Circle backgroundColor="red" width={24} height={24} />
    </Shake>
  ),
}

type Story = StoryObj<typeof Shake>

export const Basic: Story = {
  args: {
    shakeKey: 'change me',
    shakeTimes: 3,
    shakeDistance: 5,
  },
}

export default meta
