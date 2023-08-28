import { Meta, StoryObj } from '@storybook/react'
import { EventCard } from './EventCard'

const meta: Meta<typeof EventCard> = {
  title: 'ui/EventCard',
  parameters: { layout: 'centered' },
  component: EventCard,
}

type Story = StoryObj<typeof EventCard>

export const Basic: Story = {
  args: {
    title: 'Event Title',
    description: 'Lorem ipsum dolor sit, amet.',
    $gtMd: { width: 320 },
    action: {
      text: 'Show Event',
      props: { href: '', accessibilityRole: 'link', onPress: () => {} },
    },
    tags: [
      { text: 'New', theme: 'green_alt2' },
      { text: 'Hot', theme: 'orange_alt2' },
    ],
  },
}

export default meta
