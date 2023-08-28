import { Meta, StoryObj } from '@storybook/react'
import { H4, Separator, SizableText, YStack } from 'tamagui'
import { KVTable } from './KVTable'

const meta: Meta<typeof KVTable> = {
  title: 'ui/KVTable',
  parameters: { layout: 'centered' },
  component: KVTable,
}

type Story = StoryObj<typeof KVTable>

export const Basic: Story = {
  render: () => {
    return (
      <KVTable width={500}>
        <YStack gap="$4">
          <H4>Profile Data</H4>
          <Separator />
        </YStack>
        <KVTable.Row>
          <KVTable.Key>
            <SizableText fontWeight="900">Name</SizableText>
          </KVTable.Key>
          <KVTable.Value gap="$4">
            <SizableText>Nate</SizableText>

            <SizableText textDecorationLine="underline">Change</SizableText>
          </KVTable.Value>
        </KVTable.Row>

        <KVTable.Row>
          <KVTable.Key>
            <SizableText fontWeight="900">Twitter</SizableText>
          </KVTable.Key>
          <KVTable.Value gap="$4">
            <SizableText textDecorationLine="underline">@natebirdman</SizableText>
          </KVTable.Value>
        </KVTable.Row>

        <KVTable.Row>
          <KVTable.Key>
            <SizableText fontWeight="900">GitHub</SizableText>
          </KVTable.Key>
          <KVTable.Value gap="$4">
            <SizableText textDecorationLine="underline">@natew</SizableText>
          </KVTable.Value>
        </KVTable.Row>
      </KVTable>
    )
  },
}

export default meta
