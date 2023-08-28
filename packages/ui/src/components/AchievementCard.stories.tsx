import { Meta, StoryObj } from '@storybook/react'
import { User } from '@tamagui/lucide-icons'
import { AchievementCard } from './AchievementCard'

const meta: Meta<typeof AchievementCard> = {
  title: 'ui/AchievementCard',
  parameters: { layout: 'centered' },
  component: AchievementCard,
}

type Story = StoryObj<typeof AchievementCard>

export const Basic: Story = {
  args: {
    width: 320,
    icon: User,
    title: 'Get New Users',
    progress: {
      current: 10,
      full: 100,
      label: 'Things',
    },
    action: {
      text: 'Boost your community',
      props: { href: '#', accessibilityRole: 'link', onPress: () => {} }, // comes from solito's useLink
    },
  },
}

export default meta
