import { Meta, StoryObj } from '@storybook/react'
import { Star } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import { Onboarding } from './Onboarding'
import { StepContent } from './OnboardingStepContent'

const meta: Meta<typeof Onboarding> = {
  title: 'ui/Onboarding',
  parameters: { layout: 'fullscreen' },
  component: Onboarding,
  render: (props) => (
    <YStack $platform-web={{ height: '80vh' }} f={1}>
      <Onboarding {...props} />
    </YStack>
  ),
}

type Story = StoryObj<typeof Onboarding>

export const Basic: Story = {
  args: {
    steps: [
      {
        Content: () => (
          <StepContent
            title="Step 1"
            description="Minim nisi excepteur veniam non culpa proident consectetur elit cillum eu voluptate laboris."
            icon={Star}
          />
        ),
        theme: 'blue',
      },
      {
        Content: () => (
          <StepContent
            title="Step 2"
            description="Velit adipisicing magna proident aliquip dolor aute deserunt proident laborum velit anim excepteur."
            icon={Star}
          />
        ),
        theme: 'orange',
      },
    ],
  },
}

export default meta
