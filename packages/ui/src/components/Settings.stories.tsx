import { Meta, StoryObj } from '@storybook/react'
import { Box, Cog, Milestone, ShoppingCart, Users } from '@tamagui/lucide-icons'
import { Settings } from './Settings'

const meta: Meta<typeof Settings> = {
  title: 'ui/Settings',
  component: Settings,
  parameters: { layout: 'centered' },
}

type Story = StoryObj<typeof Settings>

export const Basic: Story = {
  render: (props) => (
    <Settings {...props} width={500}>
      <Settings.Items>
        <Settings.Group>
          <Settings.Item icon={Box} accentColor="$green9">
            My Items
          </Settings.Item>
          <Settings.Item icon={Users} accentColor="$orange9">
            Refer Your Friends
          </Settings.Item>
          <Settings.Item icon={Milestone} accentColor="$blue9">
            Address Info
          </Settings.Item>
        </Settings.Group>

        <Settings.Group>
          <Settings.Item icon={ShoppingCart} accentColor="$blue9">
            Purchase History
          </Settings.Item>
          <Settings.Item icon={Cog} accentColor="$gray9">
            Settings
          </Settings.Item>
        </Settings.Group>
      </Settings.Items>
    </Settings>
  ),
}

export default meta
