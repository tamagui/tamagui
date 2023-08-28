import { Meta, StoryObj } from '@storybook/react'
import { CustomToast } from './CustomToast'
import { useToastController } from '@tamagui/toast'
import { Button, XStack } from 'tamagui'

const meta: Meta<typeof CustomToast> = {
  title: 'ui/Toast',
  parameters: { layout: 'fullscreen' },
  component: function ToastTrigger() {
    const toastController = useToastController()
    return (
      <XStack gap="$2" jc="center" my="$20">
        <Button
          onPress={() =>
            toastController.show('Toast!', {
              message:
                'Nostrud esse esse in consectetur culpa adipisicing mollit fugiat in excepteur culpa.',
            })
          }
        >
          Show
        </Button>
        <Button onPress={() => toastController.hide()}>Hide</Button>
      </XStack>
    )
  },
}

type Story = StoryObj<typeof CustomToast>

export const Basic: Story = {}

export default meta
